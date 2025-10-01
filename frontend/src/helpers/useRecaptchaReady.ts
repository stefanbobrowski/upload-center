import { useContext } from 'react';
import { RecaptchaContext } from '../context/RecaptchaContext';

export const useRecaptchaReady = () => useContext(RecaptchaContext);
