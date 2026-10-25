import { DIAMOND_SOURCE, GEM_ORIGIN, Prisma, PrismaClient, STATUS } from '@prisma/client';

const upper = (value: unknown) => String(value ?? '').trim().toUpperCase();
const optionalText = (value: unknown) => String(value ?? '').trim() || null;
const numeric = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
};
const optionalUpper = (value: unknown) => upper(value) || null;
const shapeName = (value: unknown) => upper(value).replace(/\s+(CUT|BRILLIANT)$/, '');
const media = (value: unknown) => JSON.stringify(optionalText(value) ? [String(value).trim()] : []);

function validate(data: Prisma.DiamondProductCreateManyInput) {
  if (!data.sku || !data.shape || !data.color || !data.clarity ||
      data.weight === null || data.weight <= 0 ||
      data.price === null || data.price < 0 || data.rap === null || data.rap < 0) {
    throw new Error('Diamond feed record is missing valid required attributes');
  }
  data.name = `${data.shape} ${data.weight}ct ${data.color} ${data.clarity}`.slice(0, 255);
  return data;
}

export function mapNaturalDiamond(diamond: Record<string, any>): Prisma.DiamondProductCreateManyInput {
  const weight = numeric(diamond.Weight);
  const rap = numeric(diamond.Rap);
  return validate({
    sku: String(diamond.Loat_NO ?? '').trim(),
    name: '', gemOrigin: GEM_ORIGIN.NATURAL,
    shape: shapeName(diamond.Shape), weight,
    color: upper(diamond.Color), clarity: upper(diamond.Clarity),
    cut: optionalUpper(diamond.Cut), symmetry: optionalUpper(diamond.Symmetry),
    lab: optionalUpper(diamond.Lab), polish: optionalUpper(diamond.Polish),
    certificateNo: optionalText(diamond.CertiNo),
    height: numeric(diamond.Height), width: numeric(diamond.Width), length: numeric(diamond.Length),
    totalDepthInPercentage: numeric(diamond.TotalDepth),
    totalWidthInPercentage: numeric(diamond.Table),
    girdle: optionalUpper(diamond.Girdle), fluorescence: optionalUpper(diamond.Fluorescence),
    images: media(diamond.IMG_URL), videos: media(diamond.VID_URL),
    certificateUrl: optionalText(diamond.CERTI_URL),
    rap, price: numeric(diamond.NetDollar) ?? (rap !== null && weight !== null ? rap * weight : null),
    source: DIAMOND_SOURCE.API,
    status: upper(diamond.Status) === 'AVAILABLE' ? STATUS.ENABLED : STATUS.DISABLED,
    isDeleted: false,
  });
}

export function mapLabDiamond(diamond: Record<string, any>): Prisma.DiamondProductCreateManyInput {
  return validate({
    sku: String(diamond.stock_id ?? '').trim(),
    name: '', gemOrigin: GEM_ORIGIN.LAB_GROWN,
    shape: shapeName(diamond.shape), weight: numeric(diamond.weight),
    color: upper(diamond.color || diamond.fancy_color), clarity: upper(diamond.clarity),
    cut: optionalUpper(diamond.cut), symmetry: optionalUpper(diamond.symmetry),
    lab: optionalUpper(diamond.lab), polish: optionalUpper(diamond.polish),
    certificateNo: optionalText(diamond.certificate_number),
    length: numeric(diamond.measurements_length), width: numeric(diamond.measurements_width),
    height: numeric(diamond.measurements_depth),
    totalDepthInPercentage: numeric(diamond.depth), totalWidthInPercentage: numeric(diamond.table),
    girdle: optionalUpper(diamond.girdle_condition),
    fluorescence: optionalUpper(diamond.fluorescence_intensity || diamond.fluorescence_color),
    images: media(diamond.diamond_image), videos: media(diamond.diamond_video),
    certificateUrl: optionalText(diamond.certificate_image),
    rap: numeric(diamond.price_per_caret), price: numeric(diamond.final_price),
    source: DIAMOND_SOURCE.API,
    status: upper(diamond.status) === 'AVAILABLE' && diamond.is_active !== false ? STATUS.ENABLED : STATUS.DISABLED,
    isDeleted: false,
  });
}

export async function saveDiamondBatch(prisma: PrismaClient, rows: Prisma.DiamondProductCreateManyInput[]) {
  const key = (row: { gemOrigin?: GEM_ORIGIN; sku: string }) => `${row.gemOrigin}:${row.sku}`;
  const unique = [...new Map(rows.map((row) => [key(row), row])).values()];
  if (!unique.length) return { created: 0, updated: 0 };
  const existing = await prisma.diamondProduct.findMany({
    where: {
      isDeleted: false, source: DIAMOND_SOURCE.API,
      sku: { in: unique.map((row) => row.sku) },
    },
    select: { id: true, sku: true, gemOrigin: true },
  });
  const ids = new Map(existing.map((row) => [key(row), row.id]));
  const fresh = unique.filter((row) => !ids.has(key(row)));
  if (fresh.length) await prisma.diamondProduct.createMany({ data: fresh });
  const updates = unique.filter((row) => ids.has(key(row)));
  for (let i = 0; i < updates.length; i += 100) {
    await prisma.$transaction(updates.slice(i, i + 100).map((row) => prisma.diamondProduct.update({
      where: { id: ids.get(key(row)) }, data: row,
    })));
  }
  return { created: fresh.length, updated: updates.length };
}

export async function fetchDiamondFeed(provider: 'natural' | 'lab'): Promise<Record<string, any>[]> {
  const url = provider === 'natural' ? process.env.GLOWSTAR_API : process.env.DHARMATECH_API;
  if (!url || (provider === 'lab' && !process.env.DHARMATECH_API_KEY)) {
    throw new Error(`${provider} diamond provider is not configured`);
  }
  let response: Response;
  try {
    response = await fetch(url, {
      headers: provider === 'lab' ? { Authorization: process.env.DHARMATECH_API_KEY } : {},
      signal: AbortSignal.timeout(60000),
    });
  } catch {
    throw new Error(`${provider} diamond provider request failed or timed out`);
  }
  if (!response.ok) throw new Error(`${provider} diamond provider returned HTTP ${response.status}`);
  let body: any;
  try { body = await response.json(); } catch { throw new Error(`${provider} diamond provider returned invalid JSON`); }
  const rows = provider === 'natural' ? body : body?.data;
  if (!Array.isArray(rows)) throw new Error(`${provider} diamond provider returned no inventory array`);
  return rows;
}
