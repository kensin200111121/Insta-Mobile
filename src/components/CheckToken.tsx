import React, { useEffect, useRef } from 'react';
import { useAuthContext } from '../contexts/auth.context';
import useApi from '../hooks/useApi';

const CHECK_DURATION = 7 * 60 * 1000;

const TokenChecker = () => {
    const { userToken, hasOverlay } = useAuthContext();
    const request = useApi();

    useEffect(() => {
        let intervalId: any;

        if (userToken && !hasOverlay) {
            intervalId = setInterval(() => {
                request('get', '/auth/check');
            }, CHECK_DURATION);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [userToken, hasOverlay]);
    
    return null;
};

export default TokenChecker;
