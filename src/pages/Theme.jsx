import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


// =====================================================
// THEME STORAGE KEY
// =====================================================

const THEME_STORAGE_KEY = "assetsphere_theme";


// =====================================================
// DEFAULT THEME
// =====================================================

const defaultTheme = {

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

const suggestedThemes = [

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

    }

];


// =====================================================
// LOAD SAVED THEME
// =====================================================

const getSavedTheme = () => {

    try {

        const savedTheme =
            localStorage.getItem(
                THEME_STORAGE_KEY
            );

        if (savedTheme) {

            return JSON.parse(savedTheme);

        }

    } catch (error) {

        console.error(
            "Theme load error:",
            error
        );

    }

    return defaultTheme;

};


// =====================================================
// APPLY THEME TO DOCUMENT
// =====================================================

const applyTheme = (theme) => {

    const root =
        document.documentElement;


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


    document.body.style.background =
        theme.background;

};


// =====================================================
// SAVE THEME
// =====================================================

const saveTheme = (theme) => {

    try {

        localStorage.setItem(
            THEME_STORAGE_KEY,
            JSON.stringify(theme)
        );

    } catch (error) {

        console.error(
            "Theme save error:",
            error
        );

    }

};


// =====================================================
// THEME PAGE
// =====================================================

function Theme() {

    const navigate =
        useNavigate();


    // =================================================
    // STATE
    // =================================================

    const [selectedTheme, setSelectedTheme] =
        useState(getSavedTheme);


    const [customPrimary, setCustomPrimary] =
        useState(
            getSavedTheme().primary
        );


    const [customBackground, setCustomBackground] =
        useState(
            getSavedTheme().background
        );


    const [message, setMessage] =
        useState("");


    // =================================================
    // APPLY SAVED THEME ON PAGE LOAD
    // =================================================

    useEffect(() => {

        applyTheme(selectedTheme);

    }, [selectedTheme]);


    // =================================================
    // SELECT SUGGESTED THEME
    // =================================================

    const handleThemeSelect = (theme) => {

        setSelectedTheme(theme);

        setCustomPrimary(
            theme.primary
        );

        setCustomBackground(
            theme.background
        );

        applyTheme(theme);

        setMessage(
            `${theme.name} selected`
        );

    };


    // =================================================
    // APPLY CUSTOM THEME
    // =================================================

    const handleApplyCustomTheme = () => {

        const customTheme = {

            ...selectedTheme,

            name: "Custom Theme",

            primary:
                customPrimary,

            background:
                customBackground

        };


        setSelectedTheme(
            customTheme
        );


        applyTheme(
            customTheme
        );


        saveTheme(
            customTheme
        );


        setMessage(
            "Custom theme applied successfully"
        );

    };


    // =================================================
    // APPLY CURRENT THEME
    // =================================================

    const handleApply = () => {

        applyTheme(
            selectedTheme
        );


        saveTheme(
            selectedTheme
        );


        setMessage(
            "Theme applied successfully"
        );

    };


    // =================================================
    // RESET THEME
    // =================================================

    const handleReset = () => {

        setSelectedTheme(
            defaultTheme
        );


        setCustomPrimary(
            defaultTheme.primary
        );


        setCustomBackground(
            defaultTheme.background
        );


        applyTheme(
            defaultTheme
        );


        saveTheme(
            defaultTheme
        );


        setMessage(
            "Theme reset to default"
        );

    };


    // =================================================
    // BACK
    // =================================================

    const handleBack = () => {

        navigate("/settings");

    };


    // =================================================
    // RENDER
    // =================================================

    return (

        <div
            style={{
                ...pageStyle,

                background:
                    selectedTheme.background,

                color:
                    selectedTheme.text

            }}
        >

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar />


            {/* =================================================
                MAIN
            ================================================= */}

            <div
                style={{
                    ...mainStyle
                }}
            >

                <Navbar />


                {/* =================================================
                    CONTENT
                ================================================= */}

                <main
                    className="theme-content"
                    style={contentStyle}
                >

                    {/* =================================================
                        HERO
                    ================================================= */}

                    <section
                        className="theme-hero"
                        style={{
                            background:
                                `linear-gradient(
                                    135deg,
                                    ${selectedTheme.sidebar},
                                    ${selectedTheme.primary}
                                )`
                        }}
                    >

                        <div>

                            <div
                                className="theme-eyebrow"
                            >
                                ASSETSPHERE • APPEARANCE
                            </div>


                            <h1>
                                Theme & Appearance
                            </h1>


                            <p>
                                Customize the look and feel
                                of your AssetSphere application.
                            </p>

                        </div>


                        <div
                            className="theme-hero-icon"
                        >
                            🎨
                        </div>

                    </section>


                    {/* =================================================
                        BACK BUTTON
                    ================================================= */}

                    <button
                        onClick={handleBack}
                        style={{
                            ...backButtonStyle,

                            color:
                                selectedTheme.primary
                        }}
                    >

                        ← Back to Settings

                    </button>


                    {/* =================================================
                        SUCCESS MESSAGE
                    ================================================= */}

                    {message && (

                        <div
                            style={{
                                ...messageStyle,

                                borderColor:
                                    selectedTheme.primary,

                                color:
                                    selectedTheme.primary
                            }}
                        >

                            ✓ {message}

                        </div>

                    )}


                    {/* =================================================
                        SUGGESTED THEMES
                    ================================================= */}

                    <section
                        style={sectionStyle}
                    >

                        <div
                            style={
                                sectionHeadingStyle
                            }
                        >

                            <div>

                                <h2
                                    style={{
                                        ...sectionTitleStyle,

                                        color:
                                            selectedTheme.text
                                    }}
                                >
                                    Suggested Themes
                                </h2>


                                <p
                                    style={{
                                        ...sectionDescriptionStyle,

                                        color:
                                            selectedTheme.mutedText
                                    }}
                                >
                                    Choose a ready-made theme
                                    for your AssetSphere workspace.
                                </p>

                            </div>

                        </div>


                        <div
                            className="theme-grid"
                            style={themeGridStyle}
                        >

                            {suggestedThemes.map(
                                (theme) => (

                                    <ThemeCard
                                        key={
                                            theme.name
                                        }
                                        theme={theme}
                                        selected={
                                            selectedTheme.name ===
                                            theme.name
                                        }
                                        onSelect={
                                            handleThemeSelect
                                        }
                                    />

                                )
                            )}

                        </div>

                    </section>


                    {/* =================================================
                        CUSTOM THEME
                    ================================================= */}

                    <section
                        style={{
                            ...customSectionStyle,

                            background:
                                selectedTheme.card,

                            borderColor:
                                selectedTheme.border
                        }}
                    >

                        <div
                            style={
                                customHeaderStyle
                            }
                        >

                            <div>

                                <div
                                    style={{
                                        ...customEyebrowStyle,

                                        color:
                                            selectedTheme.primary
                                    }}
                                >
                                    CUSTOMIZE
                                </div>


                                <h2
                                    style={{
                                        ...customTitleStyle,

                                        color:
                                            selectedTheme.text
                                    }}
                                >
                                    Custom Theme
                                </h2>


                                <p
                                    style={{
                                        ...customDescriptionStyle,

                                        color:
                                            selectedTheme.mutedText
                                    }}
                                >
                                    Create your own color
                                    combination.
                                </p>

                            </div>


                            <div
                                style={{
                                    ...customIconStyle,

                                    background:
                                        `${selectedTheme.primary}15`,

                                    color:
                                        selectedTheme.primary
                                }}
                            >
                                ✨
                            </div>

                        </div>


                        <div
                            className="custom-controls"
                            style={customControlsStyle}
                        >

                            {/* PRIMARY COLOR */}

                            <div
                                style={
                                    colorControlStyle
                                }
                            >

                                <label
                                    style={{
                                        ...labelStyle,

                                        color:
                                            selectedTheme.text
                                    }}
                                >
                                    Primary Color
                                </label>


                                <div
                                    style={
                                        colorInputRowStyle
                                    }
                                >

                                    <input
                                        type="color"
                                        value={
                                            customPrimary
                                        }
                                        onChange={(e) =>
                                            setCustomPrimary(
                                                e.target.value
                                            )
                                        }
                                        style={
                                            colorPickerStyle
                                        }
                                    />


                                    <input
                                        type="text"
                                        value={
                                            customPrimary
                                        }
                                        onChange={(e) =>
                                            setCustomPrimary(
                                                e.target.value
                                            )
                                        }
                                        style={{
                                            ...textInputStyle,

                                            background:
                                                selectedTheme.background,

                                            color:
                                                selectedTheme.text,

                                            borderColor:
                                                selectedTheme.border
                                        }}
                                    />

                                </div>

                            </div>


                            {/* BACKGROUND COLOR */}

                            <div
                                style={
                                    colorControlStyle
                                }
                            >

                                <label
                                    style={{
                                        ...labelStyle,

                                        color:
                                            selectedTheme.text
                                    }}
                                >
                                    Background Color
                                </label>


                                <div
                                    style={
                                        colorInputRowStyle
                                    }
                                >

                                    <input
                                        type="color"
                                        value={
                                            customBackground
                                        }
                                        onChange={(e) =>
                                            setCustomBackground(
                                                e.target.value
                                            )
                                        }
                                        style={
                                            colorPickerStyle
                                        }
                                    />


                                    <input
                                        type="text"
                                        value={
                                            customBackground
                                        }
                                        onChange={(e) =>
                                            setCustomBackground(
                                                e.target.value
                                            )
                                        }
                                        style={{
                                            ...textInputStyle,

                                            background:
                                                selectedTheme.background,

                                            color:
                                                selectedTheme.text,

                                            borderColor:
                                                selectedTheme.border
                                        }}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            CUSTOM PREVIEW
                        ================================================= */}

                        <div
                            style={{
                                ...previewStyle,

                                background:
                                    customBackground,

                                borderColor:
                                    selectedTheme.border
                            }}
                        >

                            <div
                                style={{
                                    ...previewSidebarStyle,

                                    background:
                                        selectedTheme.sidebar
                                }}
                            >

                                <div
                                    style={{
                                        ...previewLogoStyle,

                                        background:
                                            customPrimary
                                    }}
                                >
                                    A
                                </div>


                                <div
                                    style={{
                                        ...previewSidebarLineStyle
                                    }}
                                />

                                <div
                                    style={{
                                        ...previewSidebarLineStyle
                                    }}
                                />

                                <div
                                    style={{
                                        ...previewSidebarLineStyle
                                    }}
                                />

                            </div>


                            <div
                                style={
                                    previewMainStyle
                                }
                            >

                                <div
                                    style={{
                                        ...previewTopBarStyle,

                                        background:
                                            selectedTheme.card,

                                        borderColor:
                                            selectedTheme.border
                                    }}
                                />

                                <div
                                    style={
                                        previewCardsStyle
                                    }
                                >

                                    <div
                                        style={{
                                            ...previewCardStyle,

                                            background:
                                                selectedTheme.card,

                                            borderColor:
                                                selectedTheme.border
                                        }}
                                    >

                                        <div
                                            style={{
                                                ...previewCircleStyle,

                                                background:
                                                    customPrimary
                                            }}
                                        />

                                        <div
                                            style={{
                                                ...previewLineStyle,

                                                background:
                                                    selectedTheme.text
                                            }}
                                        />

                                    </div>


                                    <div
                                        style={{
                                            ...previewCardStyle,

                                            background:
                                                selectedTheme.card,

                                            borderColor:
                                                selectedTheme.border
                                        }}
                                    >

                                        <div
                                            style={{
                                                ...previewCircleStyle,

                                                background:
                                                    customPrimary
                                            }}
                                        />

                                        <div
                                            style={{
                                                ...previewLineStyle,

                                                background:
                                                    selectedTheme.text
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            ACTION BUTTONS
                        ================================================= */}

                        <div
                            style={
                                actionButtonsStyle
                            }
                        >

                            <button
                                onClick={
                                    handleApplyCustomTheme
                                }
                                style={{
                                    ...applyButtonStyle,

                                    background:
                                        customPrimary
                                }}
                            >
                                ✓ Apply Custom Theme
                            </button>


                            <button
                                onClick={
                                    handleReset
                                }
                                style={{
                                    ...resetButtonStyle,

                                    color:
                                        selectedTheme.text,

                                    borderColor:
                                        selectedTheme.border,

                                    background:
                                        selectedTheme.background
                                }}
                            >
                                Reset to Default
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        CURRENT THEME
                    ================================================= */}

                    <section
                        style={{
                            ...currentThemeStyle,

                            background:
                                selectedTheme.card,

                            borderColor:
                                selectedTheme.border
                        }}
                    >

                        <div>

                            <div
                                style={{
                                    ...currentThemeLabel,

                                    color:
                                        selectedTheme.mutedText
                                }}
                            >
                                CURRENT THEME
                            </div>


                            <div
                                style={{
                                    ...currentThemeName,

                                    color:
                                        selectedTheme.text
                                }}
                            >
                                {selectedTheme.name}
                            </div>

                        </div>


                        <div
                            style={{
                                ...currentColorPreview,

                                background:
                                    selectedTheme.primary
                            }}
                        />

                    </section>


                </main>


            </div>


            {/* =========================================================
                CSS
            ========================================================= */}

            <style>
                {`

                    * {
                        box-sizing: border-box;
                    }


                    .theme-hero {

                        display: flex;

                        justify-content:
                            space-between;

                        align-items:
                            center;

                        gap: 20px;

                        padding:
                            28px 24px;

                        margin-bottom:
                            20px;

                        border-radius:
                            16px;

                        color:
                            #ffffff;

                        box-shadow:
                            0 12px 30px
                            rgba(
                                15,
                                23,
                                42,
                                0.12
                            );

                        transition:
                            background 0.25s ease;

                    }


                    .theme-eyebrow {

                        color:
                            #dbeafe;

                        font-size:
                            10px;

                        font-weight:
                            800;

                        letter-spacing:
                            1.3px;

                        margin-bottom:
                            8px;

                    }


                    .theme-hero h1 {

                        margin:
                            0;

                        color:
                            #ffffff;

                        font-size:
                            28px;

                        font-weight:
                            800;

                        letter-spacing:
                            -0.5px;

                    }


                    .theme-hero p {

                        margin:
                            7px 0 0;

                        color:
                            #dbeafe;

                        font-size:
                            12px;

                    }


                    .theme-hero-icon {

                        width:
                            50px;

                        height:
                            50px;

                        border-radius:
                            12px;

                        display:
                            flex;

                        align-items:
                            center;

                        justify-content:
                            center;

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                0.12
                            );

                        border:
                            1px solid
                            rgba(
                                255,
                                255,
                                255,
                                0.2
                            );

                        font-size:
                            23px;

                    }


                    .theme-card {

                        transition:
                            transform 0.18s ease,
                            box-shadow 0.18s ease;

                    }


                    .theme-card:hover {

                        transform:
                            translateY(-3px);

                        box-shadow:
                            0 10px 25px
                            rgba(
                                15,
                                23,
                                42,
                                0.10
                            );

                    }


                    @media (max-width: 800px) {

                        .theme-grid {

                            grid-template-columns:
                                repeat(2, minmax(0, 1fr))
                            !important;

                        }

                    }


                    @media (max-width: 600px) {

                        .theme-content {

                            padding:
                                20px !important;

                        }


                        .theme-grid {

                            grid-template-columns:
                                1fr !important;

                        }


                        .theme-hero {

                            padding:
                                22px 20px;

                        }


                        .theme-hero h1 {

                            font-size:
                                24px;

                        }


                        .theme-hero-icon {

                            display:
                                none;

                        }


                        .custom-controls {

                            grid-template-columns:
                                1fr !important;

                        }

                    }

                `}
            </style>

        </div>

    );

}


// =====================================================
// THEME CARD
// =====================================================

function ThemeCard({
    theme,
    selected,
    onSelect
}) {

    return (

        <div
            className="theme-card"
            onClick={() =>
                onSelect(theme)
            }
            style={{
                ...themeCardStyle,

                background:
                    theme.card,

                borderColor:
                    selected
                        ? theme.primary
                        : theme.border,

                boxShadow:
                    selected
                        ? `0 0 0 2px ${theme.primary}25`
                        : "none"
            }}
        >

            {/* COLOR PREVIEW */}

            <div
                style={{
                    ...themePreviewStyle,

                    background:
                        theme.background
                }}
            >

                <div
                    style={{
                        ...themePreviewSidebar,

                        background:
                            theme.sidebar
                    }}
                >

                    <div
                        style={{
                            ...themePreviewDot,

                            background:
                                theme.primary
                        }}
                    />

                    <div
                        style={
                            themePreviewSidebarLine
                        }
                    />

                    <div
                        style={
                            themePreviewSidebarLine
                        }
                    />

                    <div
                        style={
                            themePreviewSidebarLine
                        }
                    />

                </div>


                <div
                    style={
                        themePreviewContent
                    }
                >

                    <div
                        style={{
                            ...themePreviewHeader,

                            background:
                                theme.card,

                            borderColor:
                                theme.border
                        }}
                    />


                    <div
                        style={
                            themePreviewContentRow
                        }
                    >

                        <div
                            style={{
                                ...themePreviewSmallCard,

                                background:
                                    theme.card,

                                borderColor:
                                    theme.border
                            }}
                        />

                        <div
                            style={{
                                ...themePreviewSmallCard,

                                background:
                                    theme.card,

                                borderColor:
                                    theme.border
                            }}
                        />

                    </div>

                </div>

            </div>


            {/* NAME */}

            <div
                style={
                    themeCardBottomStyle
                }
            >

                <div>

                    <div
                        style={{
                            ...themeNameStyle,

                            color:
                                theme.text
                        }}
                    >
                        {theme.name}
                    </div>


                    <div
                        style={{
                            ...themeColorCodeStyle,

                            color:
                                theme.mutedText
                        }}
                    >
                        {theme.primary}
                    </div>

                </div>


                {selected && (

                    <div
                        style={{
                            ...selectedCheckStyle,

                            background:
                                theme.primary
                        }}
                    >
                        ✓
                    </div>

                )}

            </div>

        </div>

    );

}


// =====================================================
// PAGE STYLE
// =====================================================

const pageStyle = {

    display:
        "flex",

    minHeight:
        "100vh",

    transition:
        "background 0.25s ease"

};


const mainStyle = {

    flex:
        1,

    minWidth:
        0

};


const contentStyle = {

    width:
        "100%",

    maxWidth:
        "1250px",

    margin:
        "0 auto",

    padding:
        "32px",

    boxSizing:
        "border-box"

};


// =====================================================
// BACK BUTTON
// =====================================================

const backButtonStyle = {

    border:
        "none",

    background:
        "transparent",

    padding:
        "0",

    marginBottom:
        "18px",

    fontSize:
        "12px",

    fontWeight:
        "700",

    cursor:
        "pointer"

};


// =====================================================
// MESSAGE
// =====================================================

const messageStyle = {

    padding:
        "10px 14px",

    marginBottom:
        "18px",

    border:
        "1px solid",

    borderRadius:
        "9px",

    background:
        "#ffffff",

    fontSize:
        "12px",

    fontWeight:
        "700"

};


// =====================================================
// SECTION
// =====================================================

const sectionStyle = {

    marginBottom:
        "24px"

};


const sectionHeadingStyle = {

    marginBottom:
        "16px"

};


const sectionTitleStyle = {

    margin:
        0,

    fontSize:
        "18px",

    fontWeight:
        "700"

};


const sectionDescriptionStyle = {

    margin:
        "5px 0 0",

    fontSize:
        "13px"

};


// =====================================================
// THEME GRID
// =====================================================

const themeGridStyle = {

    display:
        "grid",

    gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",

    gap:
        "16px"

};


// =====================================================
// THEME CARD
// =====================================================

const themeCardStyle = {

    border:
        "1px solid",

    borderRadius:
        "14px",

    padding:
        "12px",

    cursor:
        "pointer",

    overflow:
        "hidden",

    transition:
        "all 0.18s ease"

};


// =====================================================
// THEME PREVIEW
// =====================================================

const themePreviewStyle = {

    height:
        "135px",

    borderRadius:
        "9px",

    overflow:
        "hidden",

    display:
        "flex",

    border:
        "1px solid rgba(0,0,0,0.04)"

};


const themePreviewSidebar = {

    width:
        "29%",

    padding:
        "10px 7px"

};


const themePreviewDot = {

    width:
        "18px",

    height:
        "18px",

    borderRadius:
        "5px",

    marginBottom:
        "13px"

};


const themePreviewSidebarLine = {

    height:
        "5px",

    borderRadius:
        "4px",

    background:
        "rgba(255,255,255,0.22)",

    marginBottom:
        "8px"

};


const themePreviewContent = {

    flex:
        1,

    padding:
        "8px"

};


const themePreviewHeader = {

    height:
        "18px",

    borderRadius:
        "5px",

    border:
        "1px solid",

    marginBottom:
        "10px"

};


const themePreviewContentRow = {

    display:
        "grid",

    gridTemplateColumns:
        "1fr 1fr",

    gap:
        "7px"

};


const themePreviewSmallCard = {

    height:
        "72px",

    borderRadius:
        "6px",

    border:
        "1px solid"

};


// =====================================================
// THEME CARD BOTTOM
// =====================================================

const themeCardBottomStyle = {

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "space-between",

    padding:
        "12px 3px 3px"

};


const themeNameStyle = {

    fontSize:
        "13px",

    fontWeight:
        "700"

};


const themeColorCodeStyle = {

    marginTop:
        "3px",

    fontSize:
        "10px",

    textTransform:
        "uppercase"

};


const selectedCheckStyle = {

    width:
        "24px",

    height:
        "24px",

    borderRadius:
        "50%",

    color:
        "#ffffff",

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "center",

    fontSize:
        "12px",

    fontWeight:
        "800"

};


// =====================================================
// CUSTOM SECTION
// =====================================================

const customSectionStyle = {

    border:
        "1px solid",

    borderRadius:
        "14px",

    padding:
        "22px",

    marginBottom:
        "18px"

};


const customHeaderStyle = {

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "space-between",

    marginBottom:
        "22px"

};


const customEyebrowStyle = {

    fontSize:
        "9px",

    fontWeight:
        "800",

    letterSpacing:
        "1.2px",

    marginBottom:
        "5px"

};


const customTitleStyle = {

    margin:
        0,

    fontSize:
        "17px",

    fontWeight:
        "700"

};


const customDescriptionStyle = {

    margin:
        "5px 0 0",

    fontSize:
        "12px"

};


const customIconStyle = {

    width:
        "42px",

    height:
        "42px",

    borderRadius:
        "10px",

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "center",

    fontSize:
        "18px"

};


// =====================================================
// CUSTOM CONTROLS
// =====================================================

const customControlsStyle = {

    display:
        "grid",

    gridTemplateColumns:
        "1fr 1fr",

    gap:
        "18px",

    marginBottom:
        "20px"

};


const colorControlStyle = {

    display:
        "flex",

    flexDirection:
        "column",

    gap:
        "8px"

};


const labelStyle = {

    fontSize:
        "12px",

    fontWeight:
        "700"

};


const colorInputRowStyle = {

    display:
        "flex",

    alignItems:
        "center",

    gap:
        "10px"

};


const colorPickerStyle = {

    width:
        "48px",

    height:
        "40px",

    padding:
        "3px",

    border:
        "1px solid #e5e7eb",

    borderRadius:
        "8px",

    cursor:
        "pointer"

};


const textInputStyle = {

    flex:
        1,

    height:
        "40px",

    padding:
        "0 12px",

    border:
        "1px solid",

    borderRadius:
        "8px",

    outline:
        "none",

    fontSize:
        "12px"

};


// =====================================================
// PREVIEW
// =====================================================

const previewStyle = {

    height:
        "190px",

    display:
        "flex",

    border:
        "1px solid",

    borderRadius:
        "10px",

    overflow:
        "hidden",

    marginBottom:
        "20px"

};


const previewSidebarStyle = {

    width:
        "24%",

    padding:
        "14px"

};


const previewLogoStyle = {

    width:
        "28px",

    height:
        "28px",

    borderRadius:
        "7px",

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "center",

    color:
        "#ffffff",

    fontWeight:
        "800",

    fontSize:
        "13px",

    marginBottom:
        "20px"

};


const previewSidebarLineStyle = {

    height:
        "6px",

    background:
        "rgba(255,255,255,0.2)",

    borderRadius:
        "5px",

    marginBottom:
        "10px"

};


const previewMainStyle = {

    flex:
        1,

    padding:
        "12px"

};


const previewTopBarStyle = {

    height:
        "28px",

    border:
        "1px solid",

    borderRadius:
        "6px",

    marginBottom:
        "12px"

};


const previewCardsStyle = {

    display:
        "grid",

    gridTemplateColumns:
        "1fr 1fr",

    gap:
        "10px"

};


const previewCardStyle = {

    height:
        "105px",

    border:
        "1px solid",

    borderRadius:
        "7px",

    padding:
        "12px"

};


const previewCircleStyle = {

    width:
        "20px",

    height:
        "20px",

    borderRadius:
        "6px",

    marginBottom:
        "14px"

};


const previewLineStyle = {

    height:
        "6px",

    width:
        "65%",

    borderRadius:
        "5px",

    opacity:
        0.15

};


// =====================================================
// ACTION BUTTONS
// =====================================================

const actionButtonsStyle = {

    display:
        "flex",

    gap:
        "10px",

    flexWrap:
        "wrap"

};


const applyButtonStyle = {

    border:
        "none",

    color:
        "#ffffff",

    padding:
        "10px 16px",

    borderRadius:
        "8px",

    fontSize:
        "12px",

    fontWeight:
        "700",

    cursor:
        "pointer"

};


const resetButtonStyle = {

    padding:
        "10px 16px",

    border:
        "1px solid",

    borderRadius:
        "8px",

    fontSize:
        "12px",

    fontWeight:
        "700",

    cursor:
        "pointer"

};


// =====================================================
// CURRENT THEME
// =====================================================

const currentThemeStyle = {

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "space-between",

    padding:
        "16px 18px",

    border:
        "1px solid",

    borderRadius:
        "12px"

};


const currentThemeLabel = {

    fontSize:
        "9px",

    fontWeight:
        "800",

    letterSpacing:
        "1px",

    marginBottom:
        "4px"

};


const currentThemeName = {

    fontSize:
        "13px",

    fontWeight:
        "700"

};


const currentColorPreview = {

    width:
        "32px",

    height:
        "32px",

    borderRadius:
        "8px"

};


// =====================================================
// EXPORT
// =====================================================

export default Theme;