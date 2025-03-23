import React, { useCallback, useState } from 'react';
import { Upload, Image, FilePlus, ChevronLeft, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentUploads, RegistrationData } from '@/types';

interface DocumentUploadFormProps {
  onSubmit: (data: Partial<RegistrationData>) => void;
  onBack: () => void;
  initialData?: DocumentUploads;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  onSubmit,
  onBack,
  initialData
}) => {
  const [documents, setDocuments] = useState<DocumentUploads>(
    initialData || {
      photo: null,
      addressProofDocument: null,
      panCardDocument: null,
      signatureDocument: null,
    }
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

  const base64ToFile = (base64String, filename) => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handleBase64Conversion = useCallback((base64String) => {
    const file = base64ToFile(base64String, 'identity_photo.png');
    setDocuments(prev => ({
      ...prev,
      photo: file
    }));

    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > MAX_FILE_SIZE) {
        alert("File size exceeds 5MB. Please upload a smaller file.");
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert("Only image files are allowed (JPG, PNG, etc.)");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

      setDocuments(prev => ({
        ...prev,
        photo: file
      }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ documents });
  };

  const removeFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setDocuments(prev => ({
      ...prev,
      photo: null
    }));
  }, [previewUrl]);

  const isFormValid = () => !!documents.photo;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-section">
        <div className="space-y-8">
          <div className="text-center mb-6">
            <div className="bg-brand-light/10 p-3 inline-block rounded-full mb-2">
              <Upload className="h-8 w-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-medium">Upload Your Photo</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Please upload a clear photo of your identity proof.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className={`border-2 border-dashed rounded-xl p-6 ${documents.photo ? 'border-brand-primary/50 bg-brand-primary/5' : 'border-muted hover:border-muted-foreground/50'}`}>
              <div className="flex flex-col items-center space-y-4 text-center">
                {documents.photo && previewUrl ? (
                  <>
                    <div className="w-full max-w-xs overflow-hidden rounded-lg">
                      <img src={previewUrl} alt="Identity Document" className="w-full h-auto object-contain" />
                    </div>
                    <p className="text-sm font-medium">Photo Uploaded</p>
                  </>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Identity Photo</p>
                  </>
                )}

                <label htmlFor="identity-proof-upload" className={`inline-flex items-center px-3 py-1.5 text-xs rounded-md cursor-pointer ${documents.photo ? 'bg-brand-primary/10 text-brand-primary' : 'bg-muted text-muted-foreground'}`}>
                  <FilePlus className="mr-1 h-3.5 w-3.5" />
                  {documents.photo ? 'Change Photo' : 'Upload Photo'}
                </label>
                <input 
                  id="identity-proof-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />

                {documents.photo && (
                  <Button type="button" variant="destructive" onClick={removeFile} className="mt-2">
                    <XCircle className="mr-1 h-4 w-4" />
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={onBack} className="h-11">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <Button type="submit" className="px-8 h-11 bg-brand-primary text-white" disabled={!isFormValid()}>
              Next: Photo Verification
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
