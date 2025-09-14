import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppContextType, AppData, Beneficiary, Assistance } from '@/types';
import { 
  defaultBeneficiaries, 
  defaultOrganizations, 
  defaultProjects, 
  defaultAssistances, 
  defaultAidFiles, 
  defaultUsers,
  defaultBranches
} from '@/data/mockData';
import { loadDataFromStorage, saveDataToStorage } from '@/utils/storage';



// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: AppData }
  | { type: 'ADD_BENEFICIARY'; payload: Beneficiary }
  | { type: 'UPDATE_BENEFICIARY'; payload: Beneficiary }
  | { type: 'DELETE_BENEFICIARY'; payload: number }
  | { type: 'ADD_ASSISTANCE'; payload: Assistance }
  | { type: 'UPDATE_ASSISTANCE'; payload: Assistance }
  | { type: 'DELETE_ASSISTANCE'; payload: number };

// Initial state
const initialState: AppData = {
  beneficiaries: [],
  assistances: [],
  organizations: [],
  projects: [],
  aidFiles: [],
  users: [],
  branches: []
};

// Reducer
const appReducer = (state: AppData, action: AppAction): AppData => {
  switch (action.type) {
    case 'SET_DATA':
      return action.payload;
    
    case 'ADD_BENEFICIARY':
      const newBeneficiaries = [...state.beneficiaries, action.payload];
      saveDataToStorage('beneficiaries', newBeneficiaries);
      return { ...state, beneficiaries: newBeneficiaries };
    
    case 'UPDATE_BENEFICIARY':
      const updatedBeneficiaries = state.beneficiaries.map(b => 
        b.id === action.payload.id ? action.payload : b
      );
      saveDataToStorage('beneficiaries', updatedBeneficiaries);
      return { ...state, beneficiaries: updatedBeneficiaries };
    
    case 'DELETE_BENEFICIARY':
      const filteredBeneficiaries = state.beneficiaries.filter(b => b.id !== action.payload);
      saveDataToStorage('beneficiaries', filteredBeneficiaries);
      return { ...state, beneficiaries: filteredBeneficiaries };
    
    case 'ADD_ASSISTANCE':
      const newAssistances = [...state.assistances, action.payload];
      saveDataToStorage('assistances', newAssistances);
      return { ...state, assistances: newAssistances };
    
    case 'UPDATE_ASSISTANCE':
      const updatedAssistances = state.assistances.map(a => 
        a.id === action.payload.id ? action.payload : a
      );
      saveDataToStorage('assistances', updatedAssistances);
      return { ...state, assistances: updatedAssistances };
    
    case 'DELETE_ASSISTANCE':
      const filteredAssistances = state.assistances.filter(a => a.id !== action.payload);
      saveDataToStorage('assistances', filteredAssistances);
      return { ...state, assistances: filteredAssistances };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, dispatch] = useReducer(appReducer, initialState);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    const initializeData = () => {
      try {
        setLoading(true);
        
        const appData: AppData = {
          beneficiaries: loadDataFromStorage('beneficiaries', defaultBeneficiaries),
          assistances: loadDataFromStorage('assistances', defaultAssistances),
          organizations: loadDataFromStorage('organizations', defaultOrganizations),
          projects: loadDataFromStorage('projects', defaultProjects),
          aidFiles: loadDataFromStorage('aidFiles', defaultAidFiles),
          users: loadDataFromStorage('users', defaultUsers),
          branches: loadDataFromStorage('branches', defaultBranches) as any
        };
        
        dispatch({ type: 'SET_DATA', payload: appData });
        setError(null);
      } catch (err) {
        setError('Failed to initialize application data');
        console.error('Error initializing data:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Beneficiary operations
  const addBeneficiary = async (beneficiaryData: Omit<Beneficiary, 'id' | 'createdAt'>): Promise<Beneficiary> => {
    const newBeneficiary: Beneficiary = {
      ...beneficiaryData,
      id: Math.max(...data.beneficiaries.map(b => b.id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    dispatch({ type: 'ADD_BENEFICIARY', payload: newBeneficiary });
    return newBeneficiary;
  };

  const updateBeneficiary = async (id: number, beneficiaryData: Partial<Beneficiary>): Promise<Beneficiary | null> => {
    const existingBeneficiary = data.beneficiaries.find(b => b.id === id);
    if (!existingBeneficiary) return null;

    const updatedBeneficiary = { ...existingBeneficiary, ...beneficiaryData };
    dispatch({ type: 'UPDATE_BENEFICIARY', payload: updatedBeneficiary });
    return updatedBeneficiary;
  };

  const deleteBeneficiary = async (id: number): Promise<boolean> => {
    const exists = data.beneficiaries.some(b => b.id === id);
    if (!exists) return false;

    dispatch({ type: 'DELETE_BENEFICIARY', payload: id });
    return true;
  };

  const getBeneficiaryById = (id: number): Beneficiary | undefined => {
    return data.beneficiaries.find(b => b.id === id);
  };

  const getBeneficiaryByNationalId = (nationalId: string): Beneficiary | undefined => {
    return data.beneficiaries.find(b => b.nationalId === nationalId);
  };

  // Assistance operations
  const addAssistance = async (assistanceData: Omit<Assistance, 'id' | 'date'>): Promise<Assistance> => {
    const newAssistance: Assistance = {
      ...assistanceData,
      id: Math.max(...data.assistances.map(a => a.id), 0) + 1,
      date: new Date().toISOString().split('T')[0]
    };
    
    dispatch({ type: 'ADD_ASSISTANCE', payload: newAssistance });
    return newAssistance;
  };

  const updateAssistance = async (id: number, assistanceData: Partial<Assistance>): Promise<Assistance | null> => {
    const existingAssistance = data.assistances.find(a => a.id === id);
    if (!existingAssistance) return null;

    const updatedAssistance = { ...existingAssistance, ...assistanceData };
    dispatch({ type: 'UPDATE_ASSISTANCE', payload: updatedAssistance });
    return updatedAssistance;
  };

  const deleteAssistance = async (id: number): Promise<boolean> => {
    const exists = data.assistances.some(a => a.id === id);
    if (!exists) return false;

    dispatch({ type: 'DELETE_ASSISTANCE', payload: id });
    return true;
  };

  const getAssistanceById = (id: number): Assistance | undefined => {
    return data.assistances.find(a => a.id === id);
  };

  const getAssistancesByBeneficiary = (beneficiaryId: number): Assistance[] => {
    return data.assistances.filter(a => a.beneficiaryId === beneficiaryId);
  };

  const getAssistancesByStatus = (status: Assistance['status']): Assistance[] => {
    return data.assistances.filter(a => a.status === status);
  };

  const getAssistancesByType = (type: Assistance['type']): Assistance[] => {
    return data.assistances.filter(a => a.type === type);
  };

  // Statistics functions
  const getTotalBeneficiaries = (): number => data.beneficiaries.length;
  const getTotalAssistances = (): number => data.assistances.length;
  const getTotalOrganizations = (): number => data.organizations.length;
  const getTotalProjects = (): number => data.projects.length;

  const getTotalPaidAmount = (): number => {
    return data.assistances
      .filter(a => a.status === 'مدفوع' && a.amount)
      .reduce((sum, a) => sum + (a.amount || 0), 0);
  };

  const getTotalPendingAmount = (): number => {
    return data.assistances
      .filter(a => a.status === 'معلق' && a.amount)
      .reduce((sum, a) => sum + (a.amount || 0), 0);
  };

  const getTotalApprovedAmount = (): number => {
    return data.assistances
      .filter(a => a.status === 'معتمد' && a.amount)
      .reduce((sum, a) => sum + (a.amount || 0), 0);
  };

  const getMaleBeneficiaries = (): number => {
    return data.beneficiaries.filter(b => b.gender === 'ذكر').length;
  };

  const getFemaleBeneficiaries = (): number => {
    return data.beneficiaries.filter(b => b.gender === 'أنثى').length;
  };

  const getAverageAssistanceAmount = (): number => {
    const paidAssistances = data.assistances.filter(a => a.status === 'مدفوع' && a.amount);
    if (paidAssistances.length === 0) return 0;
    
    const totalAmount = paidAssistances.reduce((sum, a) => sum + (a.amount || 0), 0);
    return Math.round(totalAmount / paidAssistances.length);
  };

  const contextValue: AppContextType = {
    data,
    loading,
    error,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    getBeneficiaryById,
    getBeneficiaryByNationalId,
    addAssistance,
    updateAssistance,
    deleteAssistance,
    getAssistanceById,
    getAssistancesByBeneficiary,
    getAssistancesByStatus,
    getAssistancesByType,
    getTotalBeneficiaries,
    getTotalAssistances,
    getTotalOrganizations,
    getTotalProjects,
    getTotalPaidAmount,
    getTotalPendingAmount,
    getTotalApprovedAmount,
    getMaleBeneficiaries,
    getFemaleBeneficiaries,
    getAverageAssistanceAmount
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
