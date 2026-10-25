'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FiTrash2, FiUpload, FiX, FiFile } from 'react-icons/fi';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from 'antd';
import Loader from "@/components/common/loader";
import {
    diamondAPI,
    Diamond,
    CreateDiamondPayload,
    UpdateDiamondPayload,
} from '@/src/services/diamond/diamond.api';
import { FaChevronDown } from 'react-icons/fa';
import { validateFile, getFileType, generateFileName } from '@/src/utils/fileUtils';
import { uploadAPI } from '@/src/services/api';
import { DIAMOND_SHAPES, DIAMOND_COLORS, DIAMOND_CLARITIES, DIAMOND_LABS } from '@/src/libs/constants';

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="text-lg font-semibold text-brand-900 mb-4 relative">
        <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-600 to-brand-500 rounded-full"></span>
        <span className="pl-4">{title}</span>
    </h3>
);

interface MediaFile {
    url: string;
    fileName?: string;
    type: 'image' | 'video';
}

interface CertificateFile {
    url: string;
    fileName?: string;
}

const AddEditDiamond: React.FC = () => {
    const router = useRouter();
    const params = useSearchParams();
    const diamondId = params.get('id') || undefined;
    const mode = params.get('mode') as 'view' | 'edit' | null;
    let isViewMode = mode === 'view';
    let isEditMode = mode === 'edit';
    let isAddMode = !diamondId && !mode;

    const [diamond, setDiamond] = useState<any>({
        name: '',
        sku: '',
        gemOrigin: 'NATURAL',
        shape: '',
        weight: '',
        color: '',
        clarity: '',
        cut: '',
        symmetry: '',
        lab: '',
        polish: '',
        certificateNo: '',
        certificateUrl: '',
        height: '',
        width: '',
        length: '',
        totalDepthInPercentage: '',
        totalWidthInPercentage: '',
        girdle: '',
        fluorescence: '',
        images: [] as MediaFile[],
        videos: [] as MediaFile[],
        rap: '',
        price: '',
        source: 'MANUAL',
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
    const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        (async () => {
            try {
                setFetching(true);
                if (diamondId) {
                    const existing = await diamondAPI.getDiamondById(diamondId);

                    console.log(existing);
                    const mapped = mapApiToForm(existing);
                    setDiamond(mapped);
                }
            } catch (e: any) {
                setError(e?.message || 'Failed to load diamond data');
            } finally {
                setFetching(false);
            }
        })();
    }, [diamondId]);

    const parseMediaArray = (media: string | null | undefined): string[] => {
        if (!media) return [];
        try {
            const parsed = JSON.parse(media);
            return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
        } catch {
            return [];
        }
    };

    const mapApiToForm = (data: Diamond): any => {
        const images = parseMediaArray(data.images).map(url => ({ url, type: 'image' as const }));
        const videos = parseMediaArray(data.videos).map(url => ({ url, type: 'video' as const }));

        return {
            name: data.name || '',
            sku: data.sku || '',
            gemOrigin: data.gemOrigin || 'NATURAL',
            shape: data.shape || '',
            weight: data.weight || '',
            color: data.color || '',
            clarity: data.clarity || '',
            cut: data.cut || '',
            symmetry: data.symmetry || '',
            lab: data.lab || '',
            polish: data.polish || '',
            certificateNo: data.certificateNo || '',
            certificateUrl: data.certificateUrl || '',
            height: data.height || '',
            width: data.width || '',
            length: data.length || '',
            totalDepthInPercentage: data.totalDepthInPercentage || '',
            totalWidthInPercentage: data.totalWidthInPercentage || '',
            girdle: data.girdle || '',
            fluorescence: data.fluorescence || '',
            images,
            videos,
            rap: data.rap || '',
            price: data.price || '',
            source: data.source || 'MANUAL',
        };
    };

    const setField = (key: string, value: any) => {
        setDiamond((prev: any) => ({ ...prev, [key]: value }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const certificateInputRef = useRef<HTMLInputElement | null>(null);

    const triggerFileSelect = (type: 'image' | 'video' | 'certificate') => {
        if (type === 'image') imageInputRef.current?.click();
        else if (type === 'video') videoInputRef.current?.click();
        else if (type === 'certificate') certificateInputRef.current?.click();
    };

    const onFilePicked = async (type: 'image' | 'video' | 'certificate', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (type === 'certificate') {
            await handleCertificateUpload(file);
        } else {
            await handleFileUpload(file, type);
        }
        e.target.value = '';
    };

    const handleFileUpload = async (file: File, type: 'image' | 'video') => {
        const validation = validateFile(file);
        if (!validation.isValid) {
            setUploadErrors(prev => ({ ...prev, [type]: validation.error || 'Invalid file' }));
            return;
        }

        setUploadErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[type];
            return newErrors;
        });

        setUploadingFiles(prev => ({ ...prev, [type]: true }));

        try {
            const fileType = getFileType(file);
            const resourceType = 'DIAMOND';
            const fileName = generateFileName(file.name, `DIAMOND_${type.toUpperCase()}`);

            const { preSignedUrl, outPutUrl } = await uploadAPI.getPresignedUrl(fileName, fileType, resourceType);
            await uploadAPI.uploadToS3(preSignedUrl, file);

            const mediaFile: MediaFile = { url: outPutUrl, fileName: fileName, type };

            if (type === 'image') {
                setDiamond((prev: any) => ({ ...prev, images: [...prev.images, mediaFile] }));
            } else {
                setDiamond((prev: any) => ({ ...prev, videos: [...prev.videos, mediaFile] }));
            }
        } catch (error: any) {
            setUploadErrors(prev => ({ ...prev, [type]: error.message || 'Failed to upload file' }));
        } finally {
            setUploadingFiles(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleCertificateUpload = async (file: File) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
            setUploadErrors(prev => ({ ...prev, certificate: validation.error || 'Invalid file' }));
            return;
        }

        if (file.type !== 'application/pdf') {
            setUploadErrors(prev => ({ ...prev, certificate: 'Only PDF files are allowed for certificates' }));
            return;
        }

        setUploadErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.certificate;
            return newErrors;
        });

        setUploadingFiles(prev => ({ ...prev, certificate: true }));

        try {
            const fileType = getFileType(file);
            const resourceType = 'DIAMOND';
            const fileName = generateFileName(file.name, 'DIAMOND_CERTIFICATE');

            const { preSignedUrl, outPutUrl } = await uploadAPI.getPresignedUrl(fileName, fileType, resourceType);
            await uploadAPI.uploadToS3(preSignedUrl, file);

            setDiamond((prev: any) => ({ ...prev, certificateUrl: outPutUrl, certificateFileName: fileName }));
        } catch (error: any) {
            setUploadErrors(prev => ({ ...prev, certificate: error.message || 'Failed to upload certificate' }));
        } finally {
            setUploadingFiles(prev => ({ ...prev, certificate: false }));
        }
    };

    const removeCertificate = async () => {
        if (!diamond.certificateUrl) return;

        const fileName = diamond.certificateFileName;
        if (fileName) {
            try {
                await uploadAPI.deleteFile(fileName, 'IMAGE', 'DIAMOND');
            } catch (error: any) {
                console.error('Failed to delete certificate from S3:', error);
            }
        }

        setDiamond((prev: any) => ({ ...prev, certificateUrl: '', certificateFileName: '' }));
    };

    const removeMedia = async (type: 'image' | 'video', index: number) => {
        const mediaArray = type === 'image' ? diamond.images : diamond.videos;
        const target = mediaArray[index];
        if (!target) return;

        const isS3File = target.fileName && target.url && (target.url.startsWith('http://') || target.url.startsWith('https://'));

        if (isS3File && target.fileName) {
            try {
                const fileName = target.fileName;
                const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
                const fileType = (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext)) ? 'IMAGE' : 'VIDEO';
                await uploadAPI.deleteFile(fileName, fileType, 'DIAMOND');
            } catch (error: any) {
                console.error('Failed to delete file from S3:', error);
            }
        }

        if (type === 'image') {
            setDiamond((prev: any) => ({ ...prev, images: prev.images.filter((_: any, i: number) => i !== index) }));
        } else {
            setDiamond((prev: any) => ({ ...prev, videos: prev.videos.filter((_: any, i: number) => i !== index) }));
        }
    };

    const validate = (): string | null => {
        if (!diamond.name?.trim()) return 'Name is required';
        if (!diamond.sku?.trim()) return 'SKU is required';
        if (!diamond.shape?.trim()) return 'Shape is required';
        if (!diamond.weight || Number(diamond.weight) <= 0) return 'Weight must be greater than 0';
        if (!diamond.color?.trim()) return 'Color is required';
        if (!diamond.clarity?.trim()) return 'Clarity is required';
        if (!diamond.rap || Number(diamond.rap) <= 0) return 'RAP must be greater than 0';
        if (!diamond.price || Number(diamond.price) <= 0) return 'Price must be greater than 0';
        return null;
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        const problem = validate();
        if (problem) {
            setLoading(false);
            setError(problem);
            return;
        }

        try {
            const images = diamond.images.map((img: MediaFile) => img.url);
            const videos = diamond.videos.map((vid: MediaFile) => vid.url);

            const payload: any = {
                name: diamond.name,
                sku: diamond.sku,
                gemOrigin: diamond.gemOrigin || 'NATURAL',
                shape: diamond.shape,
                weight: Number(diamond.weight),
                color: diamond.color,
                clarity: diamond.clarity,
                rap: Number(diamond.rap),
                price: Number(diamond.price),
                source: diamond.source,
                images,
                videos,
            };

            // Only include optional fields if they have values
            if (diamond.cut?.trim()) payload.cut = diamond.cut;
            if (diamond.symmetry?.trim()) payload.symmetry = diamond.symmetry;
            if (diamond.lab?.trim()) payload.lab = diamond.lab;
            if (diamond.polish?.trim()) payload.polish = diamond.polish;
            if (diamond.certificateNo?.trim()) payload.certificateNo = diamond.certificateNo;
            if (diamond.certificateUrl?.trim()) payload.certificateUrl = diamond.certificateUrl;
            
            // Handle numeric optional fields safely
            if (diamond.height && Number(diamond.height) > 0) payload.height = Number(diamond.height);
            if (diamond.width && Number(diamond.width) > 0) payload.width = Number(diamond.width);
            if (diamond.length && Number(diamond.length) > 0) payload.length = Number(diamond.length);
            if (diamond.totalDepthInPercentage && Number(diamond.totalDepthInPercentage) > 0) payload.totalDepthInPercentage = Number(diamond.totalDepthInPercentage);
            if (diamond.totalWidthInPercentage && Number(diamond.totalWidthInPercentage) > 0) payload.totalWidthInPercentage = Number(diamond.totalWidthInPercentage);
            
            if (diamond.girdle?.trim()) payload.girdle = diamond.girdle;
            if (diamond.fluorescence?.trim()) payload.fluorescence = diamond.fluorescence;

            if (diamondId) {
                await diamondAPI.updateDiamond(diamondId, payload);
                setSuccess('Diamond updated successfully!');
            } else {
                await diamondAPI.createDiamond(payload);
                setSuccess('Diamond created successfully!');
            }
            router.push('/diamond/diamond-list');
        } catch (e: any) {
            setError(e?.message || 'Failed to save diamond.');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label: string, value: any, onChange: (v: string) => void, props?: React.InputHTMLAttributes<HTMLInputElement>, mandatory: boolean = false) => (
        <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
                {label} {mandatory && <span className="text-red-500">*</span>}
            </label>
            <input
                {...props}
                value={value}
                onChange={(e) => !isViewMode && onChange(e.target.value)}
                placeholder={label}
                className={`peer w-full px-4 py-2 border border-brand-200 rounded-lg`}
                readOnly={isViewMode}
                disabled={isViewMode}
            />
        </div>
    );

    const selectCommonCls = 'custom-select w-full bg-white !h-[41px] flex items-center';

    return (
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-126px)]">
            <div className={`flex items-center justify-between px-6 py-2 border-b border-brand-100`}>
                <div className="flex items-center gap-2">
                    <IoMdArrowRoundBack
                        className="text-[20px] cursor-pointer hover:text-brand-600"
                        onClick={() => router.push('/diamond/diamond-list')}
                    />
                    <h1 className="text-2xl font-semibold text-brand-900">
                        {isEditMode ? 'Edit' : isAddMode ? 'Add' : 'View'} Diamond
                    </h1>
                </div>
                {isViewMode && !isEditMode && diamond.source !== "API" && (
                    <button
                        onClick={() => {
                            const newParams = new URLSearchParams(params.toString());
                            newParams.set("mode", "edit");
                            router.push(`?${newParams.toString()}`);
                        }}
                        disabled={loading || fetching}
                        className="px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white rounded-lg"
                    >
                        Edit
                    </button>
                )}
                {!isViewMode && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => diamondId ? router.push(`?id=${diamondId}&mode=view`) : router.push('/diamond/diamond-list')}
                            disabled={loading || fetching}
                            className="px-4 py-2 text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || fetching}
                            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white rounded-lg"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6 h-[calc(100%-65px)] overflow-y-scroll scrollbar space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                        <FiX className="text-red-500" />
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-brand-50 border border-brand-200 text-brand-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        {success}
                    </div>
                )}

                {fetching ? (
                    <Loader />
                ) : (
                    <>
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <SectionTitle title="Basic Information" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderInput('Name', diamond.name, (v) => setField('name', v), undefined, true)}
                                {renderInput('SKU ID', diamond.sku, (v) => setField('sku', v), undefined, true)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-brand-800 mb-2">Diamond Type</label>
                                    <Select
                                        className={`${selectCommonCls} normal-disabled-select`}
                                        value={diamond.gemOrigin || 'NATURAL'}
                                        options={[
                                            { value: 'NATURAL', label: 'Natural' },
                                            { value: 'LAB_GROWN', label: 'Lab-Grown' }
                                        ]}
                                        onChange={(val) => setField('gemOrigin', val)}
                                        placeholder="Select Diamond Type"
                                        suffixIcon={<FaChevronDown />}
                                        disabled={isViewMode}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Photos & Videos */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <SectionTitle title="Photos & Videos" />
                            
                            <div>
                                <label className="block text-sm font-medium text-brand-800 mb-2">Photos</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {diamond.images.map((img: MediaFile, idx: number) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={img.url}
                                                alt={`Diamond ${idx + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border border-brand-100"
                                            />
                                            {!isViewMode && (
                                                <button
                                                    onClick={() => removeMedia('image', idx)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {!isViewMode && (
                                        <div
                                            onClick={() => triggerFileSelect('image')}
                                            className="w-full h-32 border-2 border-dashed border-brand-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-500"
                                        >
                                            <FiUpload className="text-brand-400 text-2xl mb-2" />
                                            <span className="text-sm text-brand-600">Add Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={imageInputRef} type="file" accept="image/*" onChange={(e) => onFilePicked('image', e)} className="hidden" />
                                {uploadingFiles.image && <div className="mt-2 text-sm text-brand-700">Uploading...</div>}
                                {uploadErrors.image && <div className="mt-2 text-sm text-red-600">{uploadErrors.image}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-800 mb-2">Videos</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {diamond.videos.map((vid: MediaFile, idx: number) => (
                                        <div key={idx} className="relative group">
                                            <video src={vid.url} className="w-full h-32 object-cover rounded-lg border border-brand-100" controls />
                                            {!isViewMode && (
                                                <button
                                                    onClick={() => removeMedia('video', idx)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {!isViewMode && (
                                        <div
                                            onClick={() => triggerFileSelect('video')}
                                            className="w-full h-32 border-2 border-dashed border-brand-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-500"
                                        >
                                            <FiUpload className="text-brand-400 text-2xl mb-2" />
                                            <span className="text-sm text-brand-600">Add Video</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={videoInputRef} type="file" accept="video/*" onChange={(e) => onFilePicked('video', e)} className="hidden" />
                                {uploadingFiles.video && <div className="mt-2 text-sm text-brand-700">Uploading...</div>}
                                {uploadErrors.video && <div className="mt-2 text-sm text-red-600">{uploadErrors.video}</div>}
                            </div>
                        </div>

                        {/* Diamond Details */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <SectionTitle title="Diamond Details" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-brand-800 mb-2">
                                        Shape <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        className={`${selectCommonCls} normal-disabled-select`}
                                        value={diamond.shape || undefined}
                                        options={DIAMOND_SHAPES}
                                        onChange={(val) => {
                                            // Handle both select and custom input
                                            if (Array.isArray(val)) {
                                                setField('shape', val[val.length - 1] || '');
                                            } else {
                                                setField('shape', val);
                                            }
                                        }}
                                        onSearch={(val) => {
                                            // Allow typing custom values
                                            if (val && !DIAMOND_SHAPES.find(s => s.value === val)) {
                                                setField('shape', val);
                                            }
                                        }}
                                        placeholder="Select or type Shape"
                                        suffixIcon={<FaChevronDown />}
                                        disabled={isViewMode}
                                        showSearch
                                        allowClear
                                    />
                                </div>
                                {renderInput('Carat (Weight)', diamond.weight, (v) => setField('weight', v), { type: 'number', step: '0.01' }, true)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-brand-800 mb-2">
                                        Color <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        className={`${selectCommonCls} normal-disabled-select`}
                                        value={diamond.color || undefined}
                                        options={DIAMOND_COLORS}
                                        onChange={(val) => {
                                            if (Array.isArray(val)) {
                                                setField('color', val[val.length - 1] || '');
                                            } else {
                                                setField('color', val);
                                            }
                                        }}
                                        onSearch={(val) => {
                                            if (val && !DIAMOND_COLORS.find(c => c.value === val)) {
                                                setField('color', val);
                                            }
                                        }}
                                        placeholder="Select or type Color"
                                        suffixIcon={<FaChevronDown />}
                                        disabled={isViewMode}
                                        showSearch
                                        allowClear
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-800 mb-2">
                                        Clarity <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        className={`${selectCommonCls} normal-disabled-select`}
                                        value={diamond.clarity || undefined}
                                        options={DIAMOND_CLARITIES}
                                        onChange={(val) => {
                                            if (Array.isArray(val)) {
                                                setField('clarity', val[val.length - 1] || '');
                                            } else {
                                                setField('clarity', val);
                                            }
                                        }}
                                        onSearch={(val) => {
                                            if (val && !DIAMOND_CLARITIES.find(c => c.value === val)) {
                                                setField('clarity', val);
                                            }
                                        }}
                                        placeholder="Select or type Clarity"
                                        suffixIcon={<FaChevronDown />}
                                        disabled={isViewMode}
                                        showSearch
                                        allowClear
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderInput('Cut', diamond.cut, (v) => setField('cut', v))}
                                {renderInput('Symmetry', diamond.symmetry, (v) => setField('symmetry', v))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-brand-800 mb-2">Lab</label>
                                    <Select
                                        className={`${selectCommonCls} normal-disabled-select`}
                                        value={diamond.lab || undefined}
                                        options={DIAMOND_LABS}
                                        onChange={(val) => setField('lab', val)}
                                        placeholder="Select Lab"
                                        suffixIcon={<FaChevronDown />}
                                        disabled={isViewMode}
                                    />
                                </div>
                                {renderInput('Polish', diamond.polish, (v) => setField('polish', v))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderInput('Certificate Number', diamond.certificateNo, (v) => setField('certificateNo', v))}
                                
                                <div>
                                    <label className="block text-sm font-medium text-brand-800 mb-2">Certificate PDF</label>
                                    {diamond.certificateUrl ? (
                                        <div className="flex items-center gap-3">
                                            <div 
                                                onClick={() => window.open(diamond.certificateUrl, '_blank')}
                                                className="flex items-center gap-2 px-4 py-2 border border-brand-200 rounded-lg bg-brand-50 cursor-pointer hover:bg-brand-50 flex-1"
                                            >
                                                <AiOutlineFilePdf className="text-red-500 text-2xl" />
                                                <span className="text-sm text-brand-800 truncate">Certificate.pdf</span>
                                            </div>
                                            {!isViewMode && (
                                                <button
                                                    onClick={removeCertificate}
                                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                    type="button"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        !isViewMode && (
                                            <div
                                                onClick={() => triggerFileSelect('certificate')}
                                                className="w-full px-4 py-2 border-2 border-dashed border-brand-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:border-brand-500 hover:bg-brand-50"
                                            >
                                                <FiUpload className="text-brand-400" />
                                                <span className="text-sm text-brand-600">Upload Certificate PDF</span>
                                            </div>
                                        )
                                    )}
                                    <input 
                                        ref={certificateInputRef} 
                                        type="file" 
                                        accept="application/pdf" 
                                        onChange={(e) => onFilePicked('certificate', e)} 
                                        className="hidden" 
                                    />
                                    {uploadingFiles.certificate && <div className="mt-2 text-sm text-brand-700">Uploading certificate...</div>}
                                    {uploadErrors.certificate && <div className="mt-2 text-sm text-red-600">{uploadErrors.certificate}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Measurements */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <SectionTitle title="Measurements" />
                            
                            <div>
                                <label className="block text-sm font-medium text-brand-800 mb-2">Dimensions (L × W × H)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={diamond.length}
                                        onChange={(e) => !isViewMode && setField('length', e.target.value)}
                                        placeholder="Length"
                                        className="w-full px-4 py-2 border border-brand-200 rounded-lg"
                                        readOnly={isViewMode}
                                        disabled={isViewMode}
                                    />
                                    <span className="text-brand-600">×</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={diamond.width}
                                        onChange={(e) => !isViewMode && setField('width', e.target.value)}
                                        placeholder="Width"
                                        className="w-full px-4 py-2 border border-brand-200 rounded-lg"
                                        readOnly={isViewMode}
                                        disabled={isViewMode}
                                    />
                                    <span className="text-brand-600">×</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={diamond.height}
                                        onChange={(e) => !isViewMode && setField('height', e.target.value)}
                                        placeholder="Height"
                                        className="w-full px-4 py-2 border border-brand-200 rounded-lg"
                                        readOnly={isViewMode}
                                        disabled={isViewMode}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderInput('Total Depth %', diamond.totalDepthInPercentage, (v) => setField('totalDepthInPercentage', v), { type: 'number', step: '0.1' })}
                                {renderInput('Total Width %', diamond.totalWidthInPercentage, (v) => setField('totalWidthInPercentage', v), { type: 'number', step: '0.1' })}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderInput('Girdle', diamond.girdle, (v) => setField('girdle', v))}
                                {renderInput('Fluorescence', diamond.fluorescence, (v) => setField('fluorescence', v))}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <SectionTitle title="Pricing" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderInput('RAP', diamond.rap, (v) => setField('rap', v), { type: 'number', step: '0.01' }, true)}
                                {renderInput('Price', diamond.price, (v) => setField('price', v), { type: 'number', step: '0.01' }, true)}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AddEditDiamond;
