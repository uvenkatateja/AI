
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  // Check if file is an image
  if (!file.type.match('image.*')) {
    return {
      valid: false,
      error: "Please upload an image file (JPEG, PNG, etc.)"
    };
  }

  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return {
      valid: false,
      error: "Please upload an image smaller than 5MB"
    };
  }

  return { valid: true };
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

// Simulated API call for the demo
export const analyzeImage = async (): Promise<{
  style: string;
  confidence: number;
  recommendations: Array<{ type: string; name: string; style: string }>;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock data
  return {
    style: "casual",
    confidence: 0.87,
    recommendations: [
      { type: "top", name: "Casual Cotton T-Shirt", style: "casual" },
      { type: "bottom", name: "Relaxed Fit Jeans", style: "casual" },
      { type: "accessory", name: "Minimalist Watch", style: "casual" }
    ]
  };
};
