export interface Experience {
    id: string;
    title: string;
    category: string;
    location: string;
    rating: number;
    user: string;
    description: string;
    
    detailPage?: string;
    locationPage?: string;
    categoryPage?: string;
    userPage?: string;
    reviews?: Array<{
      text: string;
      link?: string;
    }>;
  }