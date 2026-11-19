export interface Review {
  author: string;
  initials: string;
  avatarColor: "dark" | "accent" | "muted";
  rating: number;
  quote: string;
  details: string;
}
