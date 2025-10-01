import { useContext } from 'react';
import { RecaptchaContext } from './RecaptchaProvider';

export const useRecaptchaReady = () => useContext(RecaptchaContext);
