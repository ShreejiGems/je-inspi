import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CalculatorCoreService } from 'src/core/calculator-core/calculator-core.service';

@Injectable()
export class CurrencyConversionCommand {
  constructor(private readonly calculatorCoreService: CalculatorCoreService) {}

  @Command({
    command: 'cronJob:currencyConversion',
    describe: 'Update USD to INR conversion rate',
  })
  async latestCurrencyConversion() {
    try {
      // USD -> INR
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_API_KEY}/pair/USD/INR`,
      );

      const dollarRupeeRate = response.data?.conversion_rate;

      if (!dollarRupeeRate) {
        throw new Error('Conversion rate not found');
      }

      const calculator = await this.calculatorCoreService.findFirst({
        where: { isDeleted: false },
      });

      // Store in DB
      await this.calculatorCoreService.update({
        where: { id: calculator.id },
        data: { dollarRupeeRate },
      });

      console.log(`USD → INR rate updated successfully: ${dollarRupeeRate}`);
    } catch (error) {
      console.error(
        'Error while updating USD → INR conversion:',
        error.message,
      );
    }
  }
}
