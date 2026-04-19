import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { defaultResumeData } from './resumeData';

const ResumeContext = createContext();

const STORAGE_KEY = 'internhub_resume_data';
const TEMPLATE_KEY = 'internhub_resume_template';

function loadFromStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultResumeData;
    } catch {
        return defaultResumeData;
    }
}

function loadTemplate() {
    return localStorage.getItem(TEMPLATE_KEY) || 'modern';
}

const actionTypes = {
    UPDATE_PERSONAL: 'UPDATE_PERSONAL',
    UPDATE_SUMMARY: 'UPDATE_SUMMARY',
    UPDATE_ENTRY: 'UPDATE_ENTRY',
    ADD_ENTRY: 'ADD_ENTRY',
    REMOVE_ENTRY: 'REMOVE_ENTRY',
    UPDATE_SKILLS: 'UPDATE_SKILLS',
    SET_ALL: 'SET_ALL',
    SET_TEMPLATE: 'SET_TEMPLATE',
    ADD_BULLET: 'ADD_BULLET',
    UPDATE_BULLET: 'UPDATE_BULLET',
    REMOVE_BULLET: 'REMOVE_BULLET',
};

function resumeReducer(state, action) {
    switch (action.type) {
        case actionTypes.UPDATE_PERSONAL:
            return {
                ...state,
                data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...action.payload } },
            };
        case actionTypes.UPDATE_SUMMARY:
            return {
                ...state,
                data: { ...state.data, summary: action.payload },
            };
        case actionTypes.UPDATE_ENTRY: {
            const { section, id, field, value } = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    [section]: state.data[section].map((entry) =>
                        entry.id === id ? { ...entry, [field]: value } : entry
                    ),
                },
            };
        }
        case actionTypes.ADD_ENTRY: {
            const { section, entry } = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    [section]: [...state.data[section], { ...entry, id: crypto.randomUUID() }],
                },
            };
        }
        case actionTypes.REMOVE_ENTRY: {
            const { section: sec, id: removeId } = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    [sec]: state.data[sec].filter((entry) => entry.id !== removeId),
                },
            };
        }
        case actionTypes.UPDATE_SKILLS:
            return {
                ...state,
                data: { ...state.data, skills: action.payload },
            };
        case actionTypes.SET_ALL:
            return { ...state, data: action.payload };
        case actionTypes.SET_TEMPLATE:
            return { ...state, template: action.payload };
        case actionTypes.ADD_BULLET: {
            const { section: bulletSec, entryId } = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    [bulletSec]: state.data[bulletSec].map((entry) =>
                        entry.id === entryId
                            ? { ...entry, bullets: [...entry.bullets, ''] }
                            : entry
                    ),
                },
            };
        }
        case actionTypes.UPDATE_BULLET: {
            const { section: bSec, entryId: bEntryId, bulletIndex, value: bValue } = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    [bSec]: state.data[bSec].map((entry) =>
                        entry.id === bEntryId
                            ? {
                                ...entry,
                                bullets: entry.bullets.map((b, i) => (i === bulletIndex ? bValue : b)),
                            }
                            : entry
                    ),
                },
            };
        }
        case actionTypes.REMOVE_BULLET: {
            const { section: rbSec, entryId: rbEntryId, bulletIndex: rbIdx } = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    [rbSec]: state.data[rbSec].map((entry) =>
                        entry.id === rbEntryId
                            ? { ...entry, bullets: entry.bullets.filter((_, i) => i !== rbIdx) }
                            : entry
                    ),
                },
            };
        }
        default:
            return state;
    }
}

export function ResumeProvider({ children }) {
    const [state, dispatch] = useReducer(resumeReducer, {
        data: loadFromStorage(),
        template: loadTemplate(),
    });

    const saveTimerRef = useRef(null);

    // Auto-save debounced (2s)
    useEffect(() => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
        }, 2000);
        return () => clearTimeout(saveTimerRef.current);
    }, [state.data]);

    // Save template immediately
    useEffect(() => {
        localStorage.setItem(TEMPLATE_KEY, state.template);
    }, [state.template]);

    const updatePersonal = useCallback((payload) => dispatch({ type: actionTypes.UPDATE_PERSONAL, payload }), []);
    const updateSummary = useCallback((payload) => dispatch({ type: actionTypes.UPDATE_SUMMARY, payload }), []);
    const updateEntry = useCallback((section, id, field, value) => dispatch({ type: actionTypes.UPDATE_ENTRY, payload: { section, id, field, value } }), []);
    const addEntry = useCallback((section, entry) => dispatch({ type: actionTypes.ADD_ENTRY, payload: { section, entry } }), []);
    const removeEntry = useCallback((section, id) => dispatch({ type: actionTypes.REMOVE_ENTRY, payload: { section, id } }), []);
    const updateSkills = useCallback((payload) => dispatch({ type: actionTypes.UPDATE_SKILLS, payload }), []);
    const setTemplate = useCallback((payload) => dispatch({ type: actionTypes.SET_TEMPLATE, payload }), []);
    const setAll = useCallback((payload) => dispatch({ type: actionTypes.SET_ALL, payload }), []);
    const addBullet = useCallback((section, entryId) => dispatch({ type: actionTypes.ADD_BULLET, payload: { section, entryId } }), []);
    const updateBullet = useCallback((section, entryId, bulletIndex, value) => dispatch({ type: actionTypes.UPDATE_BULLET, payload: { section, entryId, bulletIndex, value } }), []);
    const removeBullet = useCallback((section, entryId, bulletIndex) => dispatch({ type: actionTypes.REMOVE_BULLET, payload: { section, entryId, bulletIndex } }), []);

    return (
        <ResumeContext.Provider
            value={{
                resumeData: state.data,
                template: state.template,
                updatePersonal,
                updateSummary,
                updateEntry,
                addEntry,
                removeEntry,
                updateSkills,
                setTemplate,
                setAll,
                addBullet,
                updateBullet,
                removeBullet,
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const ctx = useContext(ResumeContext);
    if (!ctx) throw new Error('useResume must be used within ResumeProvider');
    return ctx;
}

export { actionTypes };
