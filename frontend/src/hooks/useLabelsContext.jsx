import { LabelContext } from "../context/LabelContext";
import { useContext } from "react";

export const useLabelContext = () => {
    const context = useContext(LabelContext)

    if(!context) {
        throw Error('useLabelContext must be inside an LabelContextProvider')
    }

    return context
}