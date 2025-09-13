class logger {
    logError(...args) {
        console.error("[RoWindy]", ...args);
    }
    
    logWarn(...args) {
        console.warn("[RoWindy]", ...args);
    }
    
    logInfo(...args) {
        console.log("[RoWindy]", ...args);
    }
}

return logger