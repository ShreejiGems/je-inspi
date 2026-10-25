
import React, { useEffect, useState } from 'react';
import { calculatorAPI } from '../../../src/services/api';
import { jewelleryCategoryAPI } from '../../../src/services/filter&sort/jewellery-price-range.api';

const PriceLimit = () => {
    const [min, setMin] = useState<number>(0);
    const [max, setMax] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchLimits = async () => {
            setLoading(true);
            setError('');
            try {
                const calculators: any = await calculatorAPI.getCalculators();
                // Use miscellaneous as min and usRate as max (or adjust as needed)
                if (calculators) {
                    setMin(calculators.filterMin || 0);
                    setMax(calculators.filterMax || 0);
                }

                console.log(calculators)
            } catch (err: any) {
                setError('Failed to fetch price limits');
            }
            setLoading(false);
        };
        fetchLimits();
    }, []);

    const handleChange = (type: 'min' | 'max', value: string) => {
        const num = Number(value);
        if (type === 'min') setMin(num);
        else setMax(num);
    };

    const handleBlur = async () => {
        setLoading(true);
        setError('');
        try {
            await jewelleryCategoryAPI.updatePriceLimit(min, max);
        } catch (err: any) {
            setError('Failed to update price limit');
        }
        setLoading(false);
    };

    console.log({ min, max });

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-96 border border-brand-50">
            <h2 className="mb-4 text-lg font-semibold">Price</h2>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="font-[500] block mb-2 text-brand-800">Minimum</label>
                    <input
                        type="number"
                        value={min}
                        onChange={e => handleChange('min', e.target.value)}
                        onBlur={handleBlur}
                        className="w-full p-2 mt-1 border border-brand-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                </div>
                <div className="flex-1">
                    <label className="font-[500] block mb-2 text-brand-800">Maximum</label>
                    <input
                        type="number"
                        value={max}
                        onChange={e => handleChange('max', e.target.value)}
                        onBlur={handleBlur}
                        className="w-full p-2 mt-1 border border-brand-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                </div>
            </div>
            {/* {loading && <div className="mt-4">Loading...</div>} */}
            {error && <div className="text-red-600 mt-4">{error}</div>}
        </div>
    );
};

export default PriceLimit;
