import { Component } from '@angular/core';

interface Kafka {
  name: string;
  address: string;
}

@Component({
  selector: 'app-production-review-integration',
  templateUrl: './production-review-integration.component.html',
  styleUrl: './production-review-integration.component.scss'
})
export class ProductionReviewIntegrationComponent {
  isModalOpen = false
  test = '';
  columns = [
    { name: '', prop: 'name' },
    { name: '地址', prop: 'address' },
    { name: '' }
  ];

  kafkaList: Kafka[] = [
    { name: 'Kafka 1', address: 'localhost:9092' },
    { name: 'Kafka 2', address: 'localhost:9093' }
  ];

  addKafka() {
    this.isModalOpen = true;
  }

  editKafka(kafka: Kafka) {
    this.isModalOpen = true;
  }

  deleteKafka(kafka: Kafka) {
    this.kafkaList = this.kafkaList.filter(item => item.name !== kafka.name);
    this.isModalOpen = true;
  }
  save() {

  }
}
