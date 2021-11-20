import { Test, TestingModule } from '@nestjs/testing';
import { GateController } from './gate.controller';
import { GateService } from './gate.service';
describe('AppController', () => {
  let gateController: GateController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GateController],
      providers: [GateService],
    }).compile();

    gateController = app.get<GateController>(GateController);
  });

  describe('root', () => {
    it('shoud return 200', async () => {
      let data: any;
      try {
        data = await gateController
          .signin({
            _id: '', username: 'abc', password: 'xyz'
          });
        expect(data.status).toBe(200);
      } catch (error) {
        expect(error).toBe(true);
      }
    })
  })
})
