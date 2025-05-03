/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file icons.tsx
 * @author Alexandru Delegeanu
 * @version 0.11
 * @description Icons used along the app design
 */

import { TRootState } from '@/store';
import { setActiveThemeIndex } from '@/store/theme/handlers';
import React from 'react';
import { BsArrowLeft, BsArrowRight, BsStars } from 'react-icons/bs';
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
  FaStar,
} from 'react-icons/fa';
import { GiSettingsKnobs, GiStarFormation } from 'react-icons/gi';
import { GoMute, GoUnmute } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import { LuMoon, LuSun } from 'react-icons/lu';
import {
  MdDelete,
  MdDragIndicator,
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
} from 'react-icons/md';
import { RxLetterCaseLowercase, RxLetterCaseToggle } from 'react-icons/rx';
import { SiCcleaner } from 'react-icons/si';
import { SlSettings } from 'react-icons/sl';
import { TbRegex, TbRegexOff } from 'react-icons/tb';
import { connect, ConnectedProps } from 'react-redux';

export const NewIcon = FaPlus;
export const DeleteIcon = MdDelete;
export const SettingsIcon = SlSettings;
export const ImportIcon = CiImport;
export const ExportIcon = CiExport;
export const EyeOpenIcon = FaEye;
export const EyeClosedIcon = FaEyeSlash;
export const SoundOnIcon = GoUnmute;
export const SoundOffIcon = GoMute;
export const RegexOnIcon = TbRegex;
export const RegexOffIcon = TbRegexOff;
export const ClearIcon = SiCcleaner;
export const CheckedIcon = FaCheck;
export const ApplyIcon = FaPencilAlt;
export const EqualsIcon = FaEquals;
export const NotEqualsIcon = FaNotEqual;
export const DuplicateIcon = FaCopy;
export const SaveIcon = FaSave;
export const CloseIcon = IoMdClose;
export const IgnoreCaseIcon = RxLetterCaseLowercase;
export const MatchCaseIcon = RxLetterCaseToggle;
export const CollapseIcon = MdOutlineKeyboardDoubleArrowUp;
export const ExpandIcon = MdOutlineKeyboardDoubleArrowDown;
export const StarsIcon = BsStars;
export const StarIcon = FaStar;
export const StarsFormation = GiStarFormation;
export const DragIcon = MdDragIndicator;
export const FiltersIcon = GiSettingsKnobs;
export const PrevIcon = BsArrowLeft;
export const NextIcon = BsArrowRight;

const ColorModeIconImpl: React.FC<TPropsFromRedux> = props => {
  return props.activeThemeIndex === 0 ? <LuMoon /> : <LuSun />;
};

// <redux>
const mapState = (state: TRootState) => ({
  activeThemeIndex: state.theme.activeThemeIndex,
});

const mapDispatch = {
  setActiveThemeIndex: setActiveThemeIndex.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const ColorModeIcon = connector(ColorModeIconImpl);
// </redux>
