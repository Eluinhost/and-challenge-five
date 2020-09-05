import { useCallback, useEffect, useState } from 'react';

export const useIsInVr = () => {
    const [isInVr, setIsInVr] = useState(false);

    const enterVr = useCallback(() => setIsInVr(true), [setIsInVr]);
    const exitVr = useCallback(() => setIsInVr(false), [setIsInVr]);

    useEffect(() => {
        window.addEventListener('enter-vr', enterVr);
        window.addEventListener('exit-vr', exitVr);

        return () => {
            window.removeEventListener('enter-vr', enterVr);
            window.removeEventListener('exit-vr', exitVr);
        };
    }, [setIsInVr, enterVr, exitVr]);

    return isInVr;
};
