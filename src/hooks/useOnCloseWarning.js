import React, { useState, useEffect } from "react";
import { Prompt } from "react-router";

const useOnCloseWarning = (message) => {
    const [isDirty, setDirty] = useState(false);

    useEffect(() => {
        //Detecting browser closing
        window.onbeforeunload = isDirty && (() => message);

        return () => {
            window.onbeforeunload = null;
        };
    }, [isDirty]);

    const routerPrompt = <Prompt message={() => message} />;

    return routerPrompt;
};

export default useOnCloseWarning;