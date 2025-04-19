// lib/iconMap.ts

import {
	Home,
	Building2,
	Settings,
	User,
	Lock,
	Map,
	Database,
	Calendar,
	Inbox,
	Search,
	ChevronDown,
	Plus,
	Pencil,
	Trash2,
	X,
	Folder,
} from "lucide-react";

// All icons available for selection
export const navIcons: Record<string, React.ElementType> = {
	Home,
	Building: Building2,
	Settings,
	User,
	Lock,
	Map,
	Database,
	Calendar,
	Inbox,
	Search,
	ChevronDown,
	Plus,
	Pencil,
	Trash: Trash2,
	X,
};

// Optional fallback/default icon
export const defaultIcon = Folder;
