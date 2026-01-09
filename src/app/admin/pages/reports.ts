import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class ReportsComponent {

  // KPI Principaux
  kpis: KPI[] = [
    { label: 'Taux de Conversion (Prospect -> Partenaire)', value: '34.5%', trend: '+2.1%', trendDirection: 'up' },
    { label: 'Délai Moyen de Signature', value: '45 Jours', trend: '-5 Jours', trendDirection: 'up' }, // 'up' (green) because reducing time is good
    { label: 'Conventions Actives', value: '86', trend: '+12', trendDirection: 'up' },
    { label: 'Satisfaction Partenaires (NPS)', value: '4.8/5', trend: 'Stable', trendDirection: 'neutral' }
  ];

  // Données Répartition Sectorielle (Pie Chart simulé)
  sectors: SectorStat[] = [
    { label: 'Privé / Entreprises', percentage: 45, count: 56, color: '#003566' },
    { label: 'Académique / Recherche', percentage: 30, count: 37, color: '#ff5400' },
    { label: 'ONG / Fondations', percentage: 15, count: 19, color: '#2ecc71' },
    { label: 'Institutionnel / Public', percentage: 10, count: 12, color: '#95a5a6' }
  ];

  // Données Évolution Annuelle (Bar Chart)
  yearlyStats: YearlyData[] = [
    { month: 'Jan', signed: 2, initiated: 5 },
    { month: 'Fév', signed: 4, initiated: 3 },
    { month: 'Mar', signed: 3, initiated: 6 },
    { month: 'Avr', signed: 5, initiated: 8 },
    { month: 'Mai', signed: 6, initiated: 7 },
    { month: 'Juin', signed: 4, initiated: 5 },
  ];

  getMaxValue(): number {
    return Math.max(...this.yearlyStats.map(d => Math.max(d.signed, d.initiated)));
  }
}
