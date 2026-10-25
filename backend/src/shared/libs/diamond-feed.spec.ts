import { GEM_ORIGIN, PrismaClient, STATUS } from '@prisma/client';
import { mapLabDiamond, mapNaturalDiamond, saveDiamondBatch } from './diamond-feed';

const natural = () => ({
  Loat_NO: 'TEST-NATURAL', Shape: ' round ', Weight: '1.2', Color: 'd',
  Clarity: 'vs1', Rap: '1000', NetDollar: '900', Status: 'Available',
});
const lab = () => ({
  stock_id: 'TEST-LAB', shape: 'Oval', weight: '2.1', color: 'F',
  clarity: 'VVS2', price_per_caret: '100', final_price: '210', status: 'AVAILABLE',
});

describe('Supplier diamond mappings', () => {
  it('normalizes natural attributes and uses the supplier net price', () => {
    expect(mapNaturalDiamond(natural())).toMatchObject({
      sku: 'TEST-NATURAL', shape: 'ROUND', weight: 1.2, color: 'D', clarity: 'VS1',
      price: 900, rap: 1000, gemOrigin: GEM_ORIGIN.NATURAL, status: STATUS.ENABLED,
    });
  });

  it('handles missing optional attributes and media', () => {
    expect(mapNaturalDiamond(natural())).toMatchObject({
      cut: null, height: null, certificateNo: null, images: '[]', videos: '[]',
    });
  });

  it('uses weight times rap when the natural net price is absent', () => {
    expect(mapNaturalDiamond({ ...natural(), NetDollar: undefined }).price).toBe(1200);
  });

  it.each([
    { Loat_NO: '' }, { Weight: 'bad' }, { Weight: 0 }, { Color: '' }, { Clarity: '' }, { Rap: -1 },
  ])('rejects invalid required attributes: %j', (invalid) => {
    expect(() => mapNaturalDiamond({ ...natural(), ...invalid })).toThrow('required attributes');
  });

  it('preserves fancy lab color when standard color is absent', () => {
    expect(mapLabDiamond({ ...lab(), color: '', fancy_color: 'Pink' }).color).toBe('PINK');
  });

  it('maps lab length, width and depth to the correct dimensions', () => {
    expect(mapLabDiamond({
      ...lab(), measurements_length: '9.5', measurements_width: '6.3', measurements_depth: '4.2',
    })).toMatchObject({ length: 9.5, width: 6.3, height: 4.2 });
  });

  it.each([{ status: 'HOLD' }, { is_active: false }])('disables unavailable lab stones: %j', (availability) => {
    expect(mapLabDiamond({ ...lab(), ...availability }).status).toBe(STATUS.DISABLED);
  });
});

describe('Diamond batch imports', () => {
  it('deduplicates rows and matches updates by origin and SKU', async () => {
    const naturalRow = mapNaturalDiamond({ ...natural(), Loat_NO: 'SAME-SKU' });
    const labRow = mapLabDiamond({ ...lab(), stock_id: 'SAME-SKU' });
    const diamondProduct = {
      findMany: jest.fn().mockResolvedValue([{ id: 'existing-natural', sku: 'SAME-SKU', gemOrigin: GEM_ORIGIN.NATURAL }]),
      createMany: jest.fn().mockResolvedValue({ count: 1 }),
      update: jest.fn().mockResolvedValue(naturalRow),
    };
    const transaction = jest.fn().mockImplementation((rows) => Promise.all(rows));
    const result = await saveDiamondBatch(
      { diamondProduct, $transaction: transaction } as unknown as PrismaClient,
      [naturalRow, labRow, labRow],
    );
    expect(result).toEqual({ created: 1, updated: 1 });
    expect(diamondProduct.createMany).toHaveBeenCalledWith({ data: [labRow] });
    expect(diamondProduct.update).toHaveBeenCalledWith({ where: { id: 'existing-natural' }, data: naturalRow });
  });

  it('skips database work for an empty batch', async () => {
    await expect(saveDiamondBatch({} as PrismaClient, [])).resolves.toEqual({ created: 0, updated: 0 });
  });
});
