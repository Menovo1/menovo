import type { ReactNode } from "react";
import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Music2,
  Send,
  Twitch,
  Youtube,
  Ghost,
  Pin,
  AtSign,
  Rss,
  MessagesSquare,
  Camera,
  Mail,
} from "lucide-react";

export type PlatformDef = {
  id: string;
  label: string;
  icon: ReactNode;
  /** Placeholder shown in the admin URL field. */
  placeholder: string;
  /** Brand colour used for the hover state. */
  color: string;
};

const i = (Icon: typeof Globe) => <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />;

export const SOCIAL_PLATFORMS: PlatformDef[] = [
  { id: "instagram", label: "Instagram", icon: i(Instagram), placeholder: "https://instagram.com/menovo", color: "#E1306C" },
  { id: "facebook", label: "Facebook", icon: i(Facebook), placeholder: "https://facebook.com/menovo", color: "#1877F2" },
  { id: "x", label: "X / Twitter", icon: i(AtSign), placeholder: "https://x.com/menovo", color: "#111111" },
  { id: "tiktok", label: "TikTok", icon: i(Music2), placeholder: "https://tiktok.com/@menovo", color: "#000000" },
  { id: "youtube", label: "YouTube", icon: i(Youtube), placeholder: "https://youtube.com/@menovo", color: "#FF0000" },
  { id: "linkedin", label: "LinkedIn", icon: i(Linkedin), placeholder: "https://linkedin.com/company/menovo", color: "#0A66C2" },
  { id: "whatsapp", label: "WhatsApp", icon: i(MessageCircle), placeholder: "https://wa.me/251946471234", color: "#25D366" },
  { id: "telegram", label: "Telegram", icon: i(Send), placeholder: "https://t.me/menovo", color: "#229ED9" },
  { id: "snapchat", label: "Snapchat", icon: i(Ghost), placeholder: "https://snapchat.com/add/menovo", color: "#FFFC00" },
  { id: "pinterest", label: "Pinterest", icon: i(Pin), placeholder: "https://pinterest.com/menovo", color: "#E60023" },
  { id: "threads", label: "Threads", icon: i(AtSign), placeholder: "https://threads.net/@menovo", color: "#111111" },
  { id: "reddit", label: "Reddit", icon: i(MessagesSquare), placeholder: "https://reddit.com/user/menovo", color: "#FF4500" },
  { id: "discord", label: "Discord", icon: i(MessagesSquare), placeholder: "https://discord.gg/menovo", color: "#5865F2" },
  { id: "github", label: "GitHub", icon: i(Github), placeholder: "https://github.com/menovo", color: "#181717" },
  { id: "twitch", label: "Twitch", icon: i(Twitch), placeholder: "https://twitch.tv/menovo", color: "#9146FF" },
  { id: "behance", label: "Behance", icon: i(Camera), placeholder: "https://behance.net/menovo", color: "#1769FF" },
  { id: "dribbble", label: "Dribbble", icon: i(Camera), placeholder: "https://dribbble.com/menovo", color: "#EA4C89" },
  { id: "email", label: "Email", icon: i(Mail), placeholder: "mailto:info@menovo.agency", color: "#FF9201" },
  { id: "blog", label: "Blog / RSS", icon: i(Rss), placeholder: "https://menovo.agency/blog", color: "#FF9201" },
  { id: "website", label: "Other website", icon: i(Globe), placeholder: "https://example.com", color: "#FF9201" },
];

export const platformDef = (id: string): PlatformDef =>
  SOCIAL_PLATFORMS.find((p) => p.id === id) ?? {
    id,
    label: id,
    icon: i(Globe),
    placeholder: "https://",
    color: "#FF9201",
  };
