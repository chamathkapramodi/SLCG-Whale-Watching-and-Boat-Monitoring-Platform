// src/components/ui/Icon.tsx
import CameraIcon from '../../assets/icons/camera.svg?react';
import ConfirmIcon from '../../assets/icons/confirm.svg?react';
import DeleteIcon from '../../assets/icons/delete.svg?react';
import DocumentIcon from '../../assets/icons/document.svg?react'; 
import EyeIcon from '../../assets/icons/eye.svg?react';
import EyeoffIcon from '../../assets/icons/eyeoff.svg?react';
import GroupIcon from '../../assets/icons/group.svg?react';
import InfoIcon from '../../assets/icons/info.svg?react';
import MicIcon from '../../assets/icons/mic.svg?react';
import NotificationIcon from '../../assets/icons/notification.svg?react';
import SearchIcon from '../../assets/icons/search.svg?react';
import UserIcon from '../../assets/icons/user.svg?react';
import VesselIcon from '../../assets/icons/vessel.svg?react';

const IconRegistry = {
  camera: CameraIcon,
  confirm: ConfirmIcon,
  delete: DeleteIcon,
  document: DocumentIcon, 
  eye: EyeIcon,
  eyeoff: EyeoffIcon,
  group: GroupIcon,
  info: InfoIcon,
  mic: MicIcon,
  notification: NotificationIcon,
  search: SearchIcon,
  user: UserIcon,
  vessel: VesselIcon,
} as const;

export type IconName = keyof typeof IconRegistry;

interface IconProps {
  name: IconName;
  className?: string; 
  size?: number;
}

export function Icon({ name, className, size = 24 }: IconProps) {
  const SvgComponent = IconRegistry[name];

  if (!SvgComponent) {
    console.warn(`Icon "${name}" does not exist in the registry.`);
    return null;
  }

  return (
    <SvgComponent 
      width={size} 
      height={size} 
      className={className} 
    />
  );
}