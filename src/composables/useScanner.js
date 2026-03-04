import { ref, watch, nextTick } from "vue";

export function useScanner(onScanFound) {
    const scanInput = ref("");
    const scanInputDisplay = ref("");
    const isScanning = ref(false);
    const scanInputEl = ref(null);

    const setFocus = () => {
        scanInputEl.value?.focus();
    };

    let scanTimeout = null;
    watch(scanInput, (val) => {
        if (!val || isScanning.value) return;

        clearTimeout(scanTimeout);
        scanTimeout = setTimeout(async () => {
            const rawData = scanInput.value.trim();
            if (rawData.length < 10) return;

            isScanning.value = true;
            const tempVal = rawData;
            scanInput.value = "";

            try {
                let userId = null;
                try {
                    const parsed = JSON.parse(tempVal);
                    userId = parsed.userId;
                } catch (e) {
                    const match = tempVal.match(/userId[^a-f\d]+([a-f\d]{24})/i);
                    if (match && match[1]) userId = match[1];
                }

                if (userId) {
                    scanInputDisplay.value = userId.substring(0, 8);
                    if (onScanFound) await onScanFound(userId);

                    setTimeout(() => {
                        scanInputDisplay.value = "";
                    }, 2000);
                }
            } finally {
                isScanning.value = false;
                await nextTick();
                setFocus();
            }
        }, 150);
    });

    return {
        scanInput,
        scanInputDisplay,
        isScanning,
        scanInputEl,
        setFocus
    };
}
