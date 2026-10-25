'use client';

import React, { useState, useEffect } from 'react';
import { calculatorAPI } from '@/src/services/api';
import { ApiError } from '@/src/types/auth';
import { DollarSign, Gem, Percent, Package, Briefcase, Globe, Wrench } from 'lucide-react';

const CalculatorPage = () => {
  const [formData, setFormData] = useState<any>({
    miscellaneous: null,
    silverPerGram: null,
    tenKtGoldPerGram: null,
    forteenKtGoldPerGram: null,
    eighteenKtGoldPerGram: null,
    extraCost: null,
    duty: null,
    profit: null,
    usRate: null,
  });
  const [formDataClone, setFormDataClone] = useState<any>({
    miscellaneous: null,
    silverPerGram: null,
    tenKtGoldPerGram: null,
    forteenKtGoldPerGram: null,
    eighteenKtGoldPerGram: null,
    extraCost: null,
    duty: null,
    profit: null,
    usRate: null,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [mode, setMode] = useState<'view' | 'edit' | 'fetch'>('fetch');

  // Fetch calculator data initially
  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      setError('');
      try {
        const data: any = await calculatorAPI.getCalculators();
        if (data) {
          setFormData({
            miscellaneous: data.miscellaneous ?? null,
            silverPerGram: data.silverPerGram ?? null,
            tenKtGoldPerGram: data.tenKtGoldPerGram ?? null,
            forteenKtGoldPerGram: data.forteenKtGoldPerGram ?? null,
            eighteenKtGoldPerGram: data.eighteenKtGoldPerGram ?? null,
            extraCost: data.extraCost ?? null,
            duty: data.duty ?? null,
            profit: data.profit ?? null,
            usRate: data.usRate ?? null,
          });
        }
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.message === 'Calculator not found') {
          setFormData({
            miscellaneous: 0,
            silverPerGram: 0,
            tenKtGoldPerGram: 0,
            forteenKtGoldPerGram: 0,
            eighteenKtGoldPerGram: 0,
            extraCost: 0,
            duty: 0,
            profit: 0,
            usRate: 0,
          });
        }
      } finally {
        setFetching(false);
        setMode('view');
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Allow only numbers or empty string
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value === '' ? null : value
      }));
      if (error) setError('');
      if (success) setSuccess('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate: check if any field is null, undefined, or empty string
    const missingFields: any = Object.entries(formData)
      .filter(([_, val]) => val === null || val === '' || isNaN(Number(val)))
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setLoading(false);
      setError('Please fill in all fields before saving.');
      return;
    }

    try {
      // Convert all values to numbers before submitting
      const payload: any = Object.fromEntries(
        Object.entries(formData).map(([key, val]) => [key, Number(val)])
      );

      await calculatorAPI.editCalculator(payload);
      setFormDataClone({ ...formData });
      setMode('view');
      setSuccess('Calculator settings saved successfully!');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to save calculator settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isView = mode === 'view';

  const renderField = (label: string, name: string, Icon?: any) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-brand-800 mb-2">
        {Icon && <Icon className="w-4 h-4 text-brand-600" />} {label}
      </label>
      {isView ? (
        <div className="bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 text-brand-900">
          {formData[name] ?? '—'}
        </div>
      ) : (
        <input
          type="text"
          name={name}
          value={formData[name] ?? ''}
          onChange={handleInputChange}
          className="peer w-full px-4 py-3 bg-brand-50 border border-brand-200 rounded-lg 
                     focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-200 
                     hover:scale-[1.01]"
          disabled={loading || fetching || mode === 'fetch'}
        />
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-100">
        <h1 className="text-2xl font-semibold text-brand-900">Jewellery Calculator</h1>

        {mode === 'view' && (
          <button
            onClick={() => { setMode('edit'); setFormDataClone(formData) }}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Edit
          </button>
        )}

        {mode === 'edit' && (
          <div className="flex space-x-3">
            <button
              onClick={() => { setMode('view'); setFormData(formDataClone) }}
              className="px-4 py-2 text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || fetching}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>


      {/* Form Content */}
      <div className="p-6 h-[calc(100%-65px)] overflow-y-scroll scrollbar">
        {fetching ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
              <p className="text-brand-700">Loading...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-brand-50 border border-brand-200 text-brand-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Miscellaneous */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-brand-900 mb-4 relative">
                <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-600 to-brand-500 rounded-full"></span>
                <span className="pl-4">Miscellaneous</span>
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {renderField('Miscellaneous', 'miscellaneous', Package)}
              </div>
            </div>

            {/* Material Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-brand-900 mb-4 relative">
                <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-600 to-brand-500 rounded-full"></span>
                <span className="pl-4">Material Labor</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField('Silver', 'silverPerGram', Gem)}
                {renderField('10KT', 'tenKtGoldPerGram', Gem)}
                {renderField('14KT', 'forteenKtGoldPerGram', Gem)}
                {renderField('18KT', 'eighteenKtGoldPerGram', Gem)}
              </div>
            </div>

            {/* Other Fields */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-brand-900 mb-4 relative">
                <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-600 to-brand-500 rounded-full"></span>
                <span className="pl-4">Other Fields</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField('Working Cost', 'extraCost', Wrench)}
                {renderField('Payment / Duty', 'duty', Briefcase)}
                {renderField('Profit', 'profit', Percent)}
                {renderField('US $ Rate', 'usRate', Globe)}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CalculatorPage;
