/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file icons.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Icons used along the app design
 */

import { CiExport, CiImport } from 'react-icons/ci';
import { FaCheck, FaEye, FaEyeSlash, FaPlus } from 'react-icons/fa';
import { GoMute, GoUnmute } from 'react-icons/go';
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
