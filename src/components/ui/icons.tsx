/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file icons.tsx
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description Icons used along the app design
 */

import { useColorMode } from '@/hooks/useColorMode';
import { CiExport, CiImport } from 'react-icons/ci';
import {
  FaCheck,
  FaCopy,
  FaEquals,
  FaEye,
  FaEyeSlash,
  FaNotEqual,
  FaPencilAlt,
  FaPlus,
  FaSave,
} from 'react-icons/fa';
import { GoMute, GoUnmute } from 'react-icons/go';
import { LuMoon, LuSun } from 'react-icons/lu';
import { MdDelete } from 'react-icons/md';
import { SiCcleaner } from 'react-icons/si';
import { SlSettings } from 'react-icons/sl';
import { TbRegex, TbRegexOff } from 'react-icons/tb';

export const NewIcon = () => <FaPlus />;
export const DeleteIcon = () => <MdDelete />;
export const SettingsIcon = () => <SlSettings />;
export const ImportIcon = () => <CiImport />;
export const ExportIcon = () => <CiExport />;
export const EyeOpenIcon = () => <FaEye />;
export const EyeClosedIcon = () => <FaEyeSlash />;
export const SoundOnIcon = () => <GoUnmute />;
export const SoundOffIcon = () => <GoMute />;
export const RegexOnIcon = () => <TbRegex />;
export const RegexOffIcon = () => <TbRegexOff />;
export const ClearIcon = () => <SiCcleaner />;
export const CheckedIcon = () => <FaCheck />;
export const ApplyIcon = () => <FaPencilAlt />;
export const ColorModeIcon = () => {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? <LuMoon /> : <LuSun />;
};
export const EqualsIcon = () => <FaEquals />;
export const NotEqualsIcon = () => <FaNotEqual />;
export const DuplicateIcon = () => <FaCopy />;
export const SaveIcon = () => <FaSave />;
