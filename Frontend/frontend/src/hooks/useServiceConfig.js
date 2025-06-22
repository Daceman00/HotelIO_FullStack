import { useIsFetching, useIsMutating, useIsRestoring } from '@tanstack/react-query';
import { useMemo } from 'react';

export const modes = {
    fetching: 'fetching',
    mutating: 'mutating',
    restoring: 'restoring',
    all: 'all',
    small: 'small'  // Add new mode
};

const useServiceConfig = (mode = modes.all) => {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    const isRestoring = useIsRestoring();

    const isPending = useMemo(() => {
        switch (mode) {
            case modes.fetching:
                return isFetching > 1;
            case modes.mutating:
                return isMutating > 0;
            case modes.restoring:
                return isRestoring;
            case modes.all:
            default:
                return isFetching > 0 || isMutating > 0 || isRestoring;
        }
    }, [mode, isFetching, isMutating, isRestoring]);

    return [isPending];
};

export default useServiceConfig;