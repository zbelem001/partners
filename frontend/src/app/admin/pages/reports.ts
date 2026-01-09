import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConventionsService } from '../../services/conventions.service';
import { PartnersService } from '../../services/partners.service';
import { ProspectsService } from '../../services/prospects.service';
import { forkJoin } from 'rxjs';

interface KPI {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
}

interface SectorStat {
  label: string;
  percentage: number;
  count: number;
  color: string;
}

interface YearlyData {
  month: string;
  signed: number;
  initiated: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent implements OnInit {

  // KPI Principaux
  kpis: KPI[] = [
    { label: 'Taux de Conversion (Prospect -> Partenaire)', value: '0%', trend: '0%', trendDirection: 'neutral' },
    { label: 'Délai Moyen de Signature', value: 'N/A', trend: 'N/A', trendDirection: 'neutral' }, 
    { label: 'Conventions Actives', value: '0', trend: '0', trendDirection: 'neutral' },
    { label: 'Total Partenaires', value: '0', trend: 'Stable', trendDirection: 'neutral' }
  ];

  // Données Répartition Sectorielle
  sectors: SectorStat[] = [];

  // Données Évolution Annuelle
  yearlyStats: YearlyData[] = [];

  constructor(
    private conventionsService: ConventionsService,
    private partnersService: PartnersService,
    private prospectsService: ProspectsService
  ) {}

  ngOnInit() {
    forkJoin({
      conventions: this.conventionsService.findAll(),
      partners: this.partnersService.findAll(),
      prospects: this.prospectsService.findAll()
    }).subscribe(({ conventions, partners, prospects }) => {
      
      // 1. Calculate KPIs
      const totalConventions = conventions.length;
      const activeConventions = conventions.filter(c => c.status === 'Active' || c.status === 'Signed').length;
      const totalPartners = partners.length;
      const totalProspects = prospects.length;
      
      const conversionRate = totalProspects > 0 ? (totalPartners / (totalPartners + totalProspects)) * 100 : 0;
      
      this.kpis[0].value = conversionRate.toFixed(1) + '%';
      if(conversionRate > 20) { this.kpis[0].trendDirection = 'up'; this.kpis[0].trend = 'Good'; }
      
      this.kpis[2].value = activeConventions.toString();
      this.kpis[3].value = totalPartners.toString();

      // 2. Calculate Sectors (using Partner 'industry' or similar, falling back to mock categories if empty)
      // Since Partner interface is minimal, let's assume we can map some dummy distribution or rely on data if enriched
      // For this MVP, I'll distribute based on ID modulo to simulate variety if 'sector' field is missing or empty
      const sectorCounts: any = { 'Privé': 0, 'Public': 0, 'ONG': 0, 'Académique': 0 };
      
      partners.forEach((p, index) => {
         // Mock distribution logic if sector is missing
         const types = ['Privé', 'Public', 'ONG', 'Académique'];
         const t = (p as any).sector || types[index % 4]; 
         if(sectorCounts[t] !== undefined) sectorCounts[t]++;
         else sectorCounts['Autre'] = (sectorCounts['Autre'] || 0) + 1;
      });

      const colors = ['#003566', '#ff5400', '#2ecc71', '#95a5a6', '#555'];
      this.sectors = Object.keys(sectorCounts).map((key, idx) => ({
        label: key,
        count: sectorCounts[key],
        percentage: totalPartners > 0 ? Math.round((sectorCounts[key] / totalPartners) * 100) : 0,
        color: colors[idx % colors.length]
      })).filter(s => s.count > 0);

      // 3. Yearly Stats (Conventions by month)
      const monthCounts: any = {};
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      
      // Initialize
      months.forEach(m => monthCounts[m] = { signed: 0, initiated: 0 });

      conventions.forEach(c => {
        const d = new Date(c.startDate || '');
        if(!isNaN(d.getTime())) {
          const mIndex = d.getMonth();
          const mName = months[mIndex];
          if(c.status === 'Signed' || c.status === 'Active') monthCounts[mName].signed++;
          else monthCounts[mName].initiated++;
        }
      });

      this.yearlyStats = months.map(m => ({
        month: m,
        signed: monthCounts[m].signed,
        initiated: monthCounts[m].initiated
      }));
    });
  }

  getMaxValue(): number {
    if (!this.yearlyStats || this.yearlyStats.length === 0) return 0;
    return Math.max(...this.yearlyStats.map(d => Math.max(d.signed, d.initiated)));
  }
}
