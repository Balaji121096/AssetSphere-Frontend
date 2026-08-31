import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


// =====================================================
// STORAGE
// =====================================================

const THEME_STORAGE_KEY = "assetsphere_theme";


// =====================================================
// DEFAULT THEME
// =====================================================

export const defaultTheme = {
    name: "AssetSphere Blue",

    primary: "#2563eb",

    background: "#f8fafc",

    sidebar: "#111827",

    card: "#ffffff",

    text: "#0f172a",

    mutedText: "#64748b",

    border: "#e5e7eb"
};


// =====================================================
// SUGGESTED THEMES
// =====================================================

export const suggestedThemes = [

    {
        name: "AssetSphere Blue",
        primary: "#2563eb",
        background: "#f8fafc",
        sidebar: "#111827",
        card: "#ffffff",
        text: "#0f172a",
        mutedText: "#64748b",
        border: "#e5e7eb"
    },

    {
        name: "Emerald",
        primary: "#059669",
        background: "#f0fdf4",
        sidebar: "#064e3b",
        card: "#ffffff",
        text: "#064e3b",
        mutedText: "#64748b",
        border: "#d1fae5"
    },

    {
        name: "Purple",
        primary: "#7c3aed",
        background: "#faf5ff",
        sidebar: "#3b0764",
        card: "#ffffff",
        text: "#2e1065",
        mutedText: "#6b7280",
        border: "#e9d5ff"
    },

    {
        name: "Orange",
        primary: "#ea580c",
        background: "#fff7ed",
        sidebar: "#431407",
        card: "#ffffff",
        text: "#431407",
        mutedText: "#78716c",
        border: "#fed7aa"
    },

    {
        name: "Dark",
        primary: "#60a5fa",
        background: "#0f172a",
        sidebar: "#020617",
        card: "#1e293b",
        text: "#f8fafc",
        mutedText: "#94a3b8",
        border: "#334155"
    },

    {
        name: "Rose",
        primary: "#e11d48",
        background: "#fff1f2",
        sidebar: "#4c0519",
        card: "#ffffff",
        text: "#4c0519",
        mutedText: "#6b7280",
        border: "#fecdd3"
    },

    {
        name: "Cyan",
        primary: "#0891b2",
        background: "#ecfeff",
        sidebar: "#083344",
        card: "#ffffff",
        text: "#164e63",
        mutedText: "#64748b",
        border: "#a5f3fc"
    },

    {
        name: "Slate",
        primary: "#475569",
        background: "#f1f5f9",
        sidebar: "#0f172a",
        card: "#ffffff",
        text: "#1e293b",
        mutedText: "#64748b",
        border: "#cbd5e1"
    }

];


// =====================================================
// LOAD THEME
// =====================================================

const loadTheme = () => {

    try {

        const saved =
            localStorage.getItem(
                THEME_STORAGE_KEY
            );

        if (saved) {

            const parsed =
                JSON.parse(saved);

            return {
                ...defaultTheme,
                ...parsed
            };

        }

    } catch (error) {

        console.error(
            "Theme loading failed:",
            error
        );

    }

    return defaultTheme;

};


// =====================================================
// APPLY CSS VARIABLES
// =====================================================

const applyThemeToDocument = (theme) => {

    const root =
        document.documentElement;

    // -------------------------------------------------
    // MAIN VARIABLES
    // -------------------------------------------------

    root.style.setProperty(
        "--primary-color",
        theme.primary
    );

    root.style.setProperty(
        "--app-background",
        theme.background
    );

    root.style.setProperty(
        "--sidebar-color",
        theme.sidebar
    );

    root.style.setProperty(
        "--card-color",
        theme.card
    );

    root.style.setProperty(
        "--text-color",
        theme.text
    );

    root.style.setProperty(
        "--muted-text-color",
        theme.mutedText
    );

    root.style.setProperty(
        "--border-color",
        theme.border
    );


    // -------------------------------------------------
    // EXTRA GLOBAL VARIABLES
    // -------------------------------------------------

    root.style.setProperty(
        "--primary-hover",
        theme.primary
    );

    root.style.setProperty(
        "--page-bg",
        theme.background
    );

    root.style.setProperty(
        "--surface-color",
        theme.card
    );

    root.style.setProperty(
        "--heading-color",
        theme.text
    );

    root.style.setProperty(
        "--secondary-text",
        theme.mutedText
    );

    root.style.setProperty(
        "--input-bg",
        theme.card
    );


    // -------------------------------------------------
    // BODY
    // -------------------------------------------------

    document.body.style.backgroundColor =
        theme.background;

    document.body.style.color =
        theme.text;


    // -------------------------------------------------
    // HTML
    // -------------------------------------------------

    root.style.backgroundColor =
        theme.background;


    // -------------------------------------------------
    // DATA ATTRIBUTE
    // -------------------------------------------------

    root.setAttribute(
        "data-theme",
        theme.name
    );

};


// =====================================================
// SAVE
// =====================================================

const saveTheme = (theme) => {

    try {

        localStorage.setItem(
            THEME_STORAGE_KEY,
            JSON.stringify(theme)
        );

    } catch (error) {

        console.error(
            "Theme save failed:",
            error
        );

    }

};


// =====================================================
// CONTEXT
// =====================================================

const ThemeContext =
    createContext(null);


// =====================================================
// PROVIDER
// =====================================================

export function ThemeProvider({ children }) {

    const [theme, setTheme] =
        useState(loadTheme);


    // -------------------------------------------------
    // APPLY WHEN THEME CHANGES
    // -------------------------------------------------

    useEffect(() => {

        applyThemeToDocument(theme);

        saveTheme(theme);

    }, [theme]);


    // -------------------------------------------------
    // SELECT THEME
    // -------------------------------------------------

    const selectTheme = (newTheme) => {

        setTheme({
            ...defaultTheme,
            ...newTheme
        });

    };


    // -------------------------------------------------
    // CUSTOM THEME
    // -------------------------------------------------

    const applyCustomTheme = ({
        primary,
        background
    }) => {

        setTheme((currentTheme) => ({

            ...currentTheme,

            name: "Custom Theme",

            primary:
                primary ||
                currentTheme.primary,

            background:
                background ||
                currentTheme.background

        }));

    };


    // -------------------------------------------------
    // RESET
    // -------------------------------------------------

    const resetTheme = () => {

        setTheme({
            ...defaultTheme
        });

    };


    return (

        <ThemeContext.Provider
            value={{
                theme,
                selectTheme,
                applyCustomTheme,
                resetTheme,
                suggestedThemes
            }}
        >

            {children}

        </ThemeContext.Provider>

    );

}


// =====================================================
// HOOK
// =====================================================

export function useTheme() {

    const context =
        useContext(ThemeContext);

    if (!context) {

        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );

    }

    return context;

}