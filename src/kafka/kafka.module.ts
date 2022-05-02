/* eslint-disable prettier/prettier */
import { Module, Global} from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';
// import { TestConsumer } from './test.consumer';

@Global()
@Module({
    providers: [ProducerService, ConsumerService ],
    exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
