'use client'

import { useState, useEffect } from 'react'
import { User, Lock, Users, Settings, Trophy, Activity, Phone, Camera, Plus, Edit, Trash2, Eye, BarChart3, Timer, Ruler, Zap, Target, CreditCard, BookOpen, UserPlus, Save, X, Upload, Play, Calendar, Award, Shield, UserCheck } from 'lucide-react'

interface Player {
  id: string
  name: string
  phone: string
  photo?: string
  position?: string // Adicionado campo posição
  physicalMeasures: {
    height: number
    weight: number
    bodyFat: number
    muscleMass: number
  }
  speedTests: {
    ballControl: number // 1-10 scale
    sprint50m: number // seconds
    sprint100m: number // seconds
    endurance1km: number // minutes
  }
  evolution: Array<{
    date: string
    ballControl: number
    sprint50m: number
    sprint100m: number
    endurance1km: number
  }>
  registrationDate: string
  paymentStatus: 'pending' | 'paid' | 'overdue'
  gpsData?: Array<{
    x: number
    y: number
    timestamp: number
    intensity: number
  }>
  // Credenciais de login para atletas
  username?: string
  password?: string
}

interface TechnicalStaff {
  id: string
  name: string
  role: string
  photo: string
}

interface SpeedConfig {
  ballControl: { low: number, medium: number, high: number }
  sprint50m: { low: number, medium: number, high: number }
  sprint100m: { low: number, medium: number, high: number }
  endurance1km: { low: number, medium: number, high: number }
}

interface FieldDimensions {
  length: number // metros
  width: number // metros
  useCustom: boolean
}

interface TeamSettings {
  teamLogo: string
  teamName: string
  playersPerTeam: number // Quantidade de jogadores por time (5x5, 6x6, etc.)
}

// Formações táticas disponíveis baseadas na quantidade de jogadores
const getFormationForPlayers = (playersCount: number) => {
  switch (playersCount) {
    case 5:
      return {
        '2-1-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 30, y: 35, name: 'Zagueiro' },
          { position: 'CB', x: 30, y: 65, name: 'Zagueiro' },
          { position: 'CM', x: 60, y: 50, name: 'Meio-campo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ],
        '1-2-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 30, y: 50, name: 'Zagueiro' },
          { position: 'CM', x: 60, y: 35, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 65, name: 'Meio-campo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ]
      }
    case 6:
      return {
        '2-2-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 30, y: 35, name: 'Zagueiro' },
          { position: 'CB', x: 30, y: 65, name: 'Zagueiro' },
          { position: 'CM', x: 60, y: 35, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 65, name: 'Meio-campo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ],
        '1-3-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 30, y: 50, name: 'Zagueiro' },
          { position: 'CM', x: 60, y: 30, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 50, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 70, name: 'Meio-campo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ]
      }
    case 7:
      return {
        '3-2-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 30, y: 30, name: 'Zagueiro' },
          { position: 'CB', x: 30, y: 50, name: 'Zagueiro' },
          { position: 'CB', x: 30, y: 70, name: 'Zagueiro' },
          { position: 'CM', x: 60, y: 40, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 60, name: 'Meio-campo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ],
        '2-3-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 30, y: 35, name: 'Zagueiro' },
          { position: 'CB', x: 30, y: 65, name: 'Zagueiro' },
          { position: 'CM', x: 60, y: 30, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 50, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 70, name: 'Meio-campo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ]
      }
    case 8:
      return {
        '3-3-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 30, y: 30, name: 'Zagueiro' },
          { position: 'CB', x: 30, y: 50, name: 'Zagueiro' },
          { position: 'CB', x: 30, y: 70, name: 'Zagueiro' },
          { position: 'CM', x: 60, y: 30, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 50, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 70, name: 'Meio-campo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ],
        '2-4-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 30, y: 35, name: 'Zagueiro' },
          { position: 'CB', x: 30, y: 65, name: 'Zagueiro' },
          { position: 'CM', x: 60, y: 25, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 40, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 60, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 75, name: 'Meio-campo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ]
      }
    case 9:
      return {
        '3-4-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 30, y: 30, name: 'Zagueiro' },
          { position: 'CB', x: 30, y: 50, name: 'Zagueiro' },
          { position: 'CB', x: 30, y: 70, name: 'Zagueiro' },
          { position: 'CM', x: 60, y: 25, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 40, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 60, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 75, name: 'Meio-campo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ],
        '2-5-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 30, y: 35, name: 'Zagueiro' },
          { position: 'CB', x: 30, y: 65, name: 'Zagueiro' },
          { position: 'CM', x: 60, y: 20, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 35, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 50, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 65, name: 'Meio-campo' },
          { position: 'CM', x: 60, y: 80, name: 'Meio-campo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ]
      }
    case 10:
      return {
        '4-4-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'RB', x: 25, y: 20, name: 'Lateral Direito' },
          { position: 'CB', x: 25, y: 35, name: 'Zagueiro' },
          { position: 'CB', x: 25, y: 65, name: 'Zagueiro' },
          { position: 'LB', x: 25, y: 80, name: 'Lateral Esquerdo' },
          { position: 'RM', x: 60, y: 20, name: 'Meio-campo Direito' },
          { position: 'CM', x: 60, y: 35, name: 'Meio-campo Central' },
          { position: 'CM', x: 60, y: 65, name: 'Meio-campo Central' },
          { position: 'LM', x: 60, y: 80, name: 'Meio-campo Esquerdo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ],
        '3-5-1': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 25, y: 30, name: 'Zagueiro' },
          { position: 'CB', x: 25, y: 50, name: 'Zagueiro Central' },
          { position: 'CB', x: 25, y: 70, name: 'Zagueiro' },
          { position: 'RWB', x: 50, y: 15, name: 'Ala Direito' },
          { position: 'CM', x: 60, y: 35, name: 'Meio-campo' },
          { position: 'CDM', x: 60, y: 50, name: 'Volante' },
          { position: 'CM', x: 60, y: 65, name: 'Meio-campo' },
          { position: 'LWB', x: 50, y: 85, name: 'Ala Esquerdo' },
          { position: 'ST', x: 85, y: 50, name: 'Atacante' }
        ]
      }
    default: // 11 jogadores
      return {
        '4-4-2': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'RB', x: 25, y: 20, name: 'Lateral Direito' },
          { position: 'CB', x: 25, y: 35, name: 'Zagueiro' },
          { position: 'CB', x: 25, y: 65, name: 'Zagueiro' },
          { position: 'LB', x: 25, y: 80, name: 'Lateral Esquerdo' },
          { position: 'RM', x: 50, y: 20, name: 'Meio-campo Direito' },
          { position: 'CM', x: 50, y: 35, name: 'Meio-campo Central' },
          { position: 'CM', x: 50, y: 65, name: 'Meio-campo Central' },
          { position: 'LM', x: 50, y: 80, name: 'Meio-campo Esquerdo' },
          { position: 'ST', x: 75, y: 40, name: 'Atacante' },
          { position: 'ST', x: 75, y: 60, name: 'Atacante' }
        ],
        '4-3-3': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'RB', x: 25, y: 15, name: 'Lateral Direito' },
          { position: 'CB', x: 25, y: 35, name: 'Zagueiro' },
          { position: 'CB', x: 25, y: 65, name: 'Zagueiro' },
          { position: 'LB', x: 25, y: 85, name: 'Lateral Esquerdo' },
          { position: 'CDM', x: 45, y: 50, name: 'Volante' },
          { position: 'CM', x: 55, y: 35, name: 'Meio-campo' },
          { position: 'CM', x: 55, y: 65, name: 'Meio-campo' },
          { position: 'RW', x: 75, y: 20, name: 'Ponta Direita' },
          { position: 'ST', x: 75, y: 50, name: 'Centroavante' },
          { position: 'LW', x: 75, y: 80, name: 'Ponta Esquerda' }
        ],
        '3-5-2': [
          { position: 'GK', x: 10, y: 50, name: 'Goleiro' },
          { position: 'CB', x: 25, y: 30, name: 'Zagueiro' },
          { position: 'CB', x: 25, y: 50, name: 'Zagueiro Central' },
          { position: 'CB', x: 25, y: 70, name: 'Zagueiro' },
          { position: 'RWB', x: 45, y: 15, name: 'Ala Direito' },
          { position: 'CM', x: 50, y: 35, name: 'Meio-campo' },
          { position: 'CDM', x: 50, y: 50, name: 'Volante' },
          { position: 'CM', x: 50, y: 65, name: 'Meio-campo' },
          { position: 'LWB', x: 45, y: 85, name: 'Ala Esquerdo' },
          { position: 'ST', x: 75, y: 40, name: 'Atacante' },
          { position: 'ST', x: 75, y: 60, name: 'Atacante' }
        ]
      }
  }
}

// Função para salvar no localStorage com tratamento de erro
const safeLocalStorageSet = (key: string, value: any) => {
  try {
    const serializedValue = JSON.stringify(value)
    
    // Verificar se o valor é muito grande (limite aproximado de 5MB)
    if (serializedValue.length > 5000000) {
      console.warn(`Dados muito grandes para ${key}, aplicando compressão...`)
      
      // Se for dados de jogadores, manter apenas os essenciais
      if (key === 'soccerManager_players' && Array.isArray(value)) {
        const compressedPlayers = value.map(player => ({
          ...player,
          // Limitar dados GPS para os últimos 50 pontos
          gpsData: player.gpsData ? player.gpsData.slice(-50) : [],
          // Limitar evolução para os últimos 10 registros
          evolution: player.evolution ? player.evolution.slice(-10) : []
        }))
        localStorage.setItem(key, JSON.stringify(compressedPlayers))
        return
      }
    }
    
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded, clearing old data...')
      
      // Limpar dados antigos e tentar novamente
      try {
        // Manter apenas dados essenciais
        const essentialKeys = ['soccerManager_teamSettings', 'soccerManager_speedConfig', 'soccerManager_fieldDimensions']
        const allKeys = Object.keys(localStorage)
        
        allKeys.forEach(storageKey => {
          if (storageKey.startsWith('soccerManager_') && !essentialKeys.includes(storageKey)) {
            localStorage.removeItem(storageKey)
          }
        })
        
        // Tentar salvar novamente com dados comprimidos
        if (key === 'soccerManager_players' && Array.isArray(value)) {
          const minimalPlayers = value.map(player => ({
            id: player.id,
            name: player.name,
            phone: player.phone,
            photo: player.photo,
            position: player.position,
            username: player.username,
            password: player.password,
            physicalMeasures: player.physicalMeasures,
            speedTests: player.speedTests,
            registrationDate: player.registrationDate,
            paymentStatus: player.paymentStatus,
            // Manter apenas dados GPS mais recentes
            gpsData: player.gpsData ? player.gpsData.slice(-20) : [],
            // Manter apenas evolução mais recente
            evolution: player.evolution ? player.evolution.slice(-5) : []
          }))
          localStorage.setItem(key, JSON.stringify(minimalPlayers))
        } else {
          localStorage.setItem(key, JSON.stringify(value))
        }
      } catch (secondError) {
        console.error('Failed to save to localStorage even after cleanup:', secondError)
        // Como último recurso, salvar apenas configurações básicas
        if (key === 'soccerManager_players') {
          const basicPlayers = Array.isArray(value) ? value.map(player => ({
            id: player.id,
            name: player.name,
            phone: player.phone,
            position: player.position,
            registrationDate: player.registrationDate,
            paymentStatus: player.paymentStatus,
            physicalMeasures: player.physicalMeasures,
            speedTests: player.speedTests,
            evolution: [],
            gpsData: []
          })) : []
          
          try {
            localStorage.setItem(key, JSON.stringify(basicPlayers))
          } catch (finalError) {
            console.error('Critical: Cannot save player data:', finalError)
          }
        }
      }
    } else {
      console.error('Error saving to localStorage:', error)
    }
  }
}

// Função para carregar do localStorage com fallback
const safeLocalStorageGet = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

export default function SoccerManagementApp() {
  const [userType, setUserType] = useState<'admin' | 'athlete' | null>(null)
  const [currentUser, setCurrentUser] = useState<'admin' | 'player' | null>(null)
  const [loggedInPlayer, setLoggedInPlayer] = useState<Player | null>(null)
  const [currentView, setCurrentView] = useState<'userSelection' | 'login' | 'dashboard' | 'players' | 'register' | 'settings' | 'payment' | 'manual' | 'training' | 'friendly' | 'championship'>('userSelection')
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedFormation, setSelectedFormation] = useState<string>('')
  const [technicalStaff, setTechnicalStaff] = useState<TechnicalStaff[]>([
    { id: '1', name: 'Carlos Silva', role: 'Técnico Principal', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: '2', name: 'Ana Santos', role: 'Preparadora Física', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
    { id: '3', name: 'João Oliveira', role: 'Auxiliar Técnico', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }
  ])
  const [speedConfig, setSpeedConfig] = useState<SpeedConfig>({
    ballControl: { low: 3, medium: 6, high: 9 },
    sprint50m: { low: 8.0, medium: 6.5, high: 5.5 },
    sprint100m: { low: 15.0, medium: 12.5, high: 10.5 },
    endurance1km: { low: 6.0, medium: 4.5, high: 3.5 }
  })
  const [fieldDimensions, setFieldDimensions] = useState<FieldDimensions>({
    length: 105, // FIFA padrão
    width: 68,   // FIFA padrão
    useCustom: false
  })
  const [teamSettings, setTeamSettings] = useState<TeamSettings>({
    teamLogo: '',
    teamName: 'Soccer Manager',
    playersPerTeam: 11 // Padrão 11x11, mas pode ser alterado para 5x5, 6x6, etc.
  })
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showPlayerForm, setShowPlayerForm] = useState(false)
  const [showStaffForm, setShowStaffForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<TechnicalStaff | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    phone: '',
    photo: '',
    position: '',
    username: '',
    password: '',
    physicalMeasures: { height: 0, weight: 0, bodyFat: 0, muscleMass: 0 },
    speedTests: { ballControl: 0, sprint50m: 0, sprint100m: 0, endurance1km: 0 }
  })

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedPlayers = safeLocalStorageGet('soccerManager_players', [])
    const savedStaff = safeLocalStorageGet('soccerManager_staff', null)
    const savedFieldDimensions = safeLocalStorageGet('soccerManager_fieldDimensions', null)
    const savedTeamSettings = safeLocalStorageGet('soccerManager_teamSettings', null)
    const savedSpeedConfig = safeLocalStorageGet('soccerManager_speedConfig', null)

    if (savedPlayers && savedPlayers.length > 0) {
      setPlayers(savedPlayers)
    }
    if (savedStaff) {
      setTechnicalStaff(savedStaff)
    }
    if (savedFieldDimensions) {
      setFieldDimensions(savedFieldDimensions)
    }
    if (savedTeamSettings) {
      const settings = savedTeamSettings
      setTeamSettings(settings)
      // Definir formação padrão baseada na quantidade de jogadores
      const formations = getFormationForPlayers(settings.playersPerTeam)
      setSelectedFormation(Object.keys(formations)[0])
    }
    if (savedSpeedConfig) {
      setSpeedConfig(savedSpeedConfig)
    }
  }, [])

  // Atualizar formação quando mudar quantidade de jogadores - CORRIGIDO PARA EVITAR LOOP
  useEffect(() => {
    const formations = getFormationForPlayers(teamSettings.playersPerTeam)
    const formationKeys = Object.keys(formations)
    if (formationKeys.length > 0 && !formationKeys.includes(selectedFormation))
      setSelectedFormation(formationKeys[0])
    // serialize para manter estrutura constante
  }, [JSON.stringify(teamSettings.playersPerTeam), selectedFormation])

  // Salvar dados no localStorage sempre que houver mudanças - COM PROTEÇÃO
  useEffect(() => {
    if (players.length > 0) {
      safeLocalStorageSet('soccerManager_players', players)
    }
  }, [players])

  useEffect(() => {
    if (technicalStaff.length > 0) {
      safeLocalStorageSet('soccerManager_staff', technicalStaff)
    }
  }, [technicalStaff])

  useEffect(() => {
    safeLocalStorageSet('soccerManager_fieldDimensions', fieldDimensions)
  }, [fieldDimensions])

  useEffect(() => {
    safeLocalStorageSet('soccerManager_teamSettings', teamSettings)
  }, [teamSettings])

  useEffect(() => {
    safeLocalStorageSet('soccerManager_speedConfig', speedConfig)
  }, [speedConfig])

  const handleUserTypeSelection = (type: 'admin' | 'athlete') => {
    setUserType(type)
    setCurrentView('login')
  }

  const handleLogin = () => {
    if (userType === 'admin') {
      if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
        setCurrentUser('admin')
        setCurrentView('dashboard')
      } else {
        alert('Credenciais de administrador inválidas!')
      }
    } else if (userType === 'athlete') {
      // Verificar se é um atleta cadastrado com credenciais padrão ou personalizadas
      const player = players.find(p => {
        // Verificar credenciais personalizadas primeiro
        if (p.username && p.password) {
          return p.username === loginForm.username && p.password === loginForm.password
        }
        // Fallback para credenciais padrão se não tiver personalizadas
        return loginForm.username === 'jogador' && loginForm.password === 'jogador123'
      })
      
      if (player) {
        setCurrentUser('player')
        setLoggedInPlayer(player)
        setCurrentView('dashboard')
      } else {
        // Verificar se existe pelo menos um jogador cadastrado
        if (players.length === 0) {
          alert('Nenhum atleta foi cadastrado ainda. Entre em contato com o administrador.')
        } else {
          alert('Credenciais inválidas! Use "jogador" e "jogador123" ou as credenciais fornecidas pelo administrador.')
        }
      }
    }
  }

  const handleLogout = () => {
    setUserType(null)
    setCurrentUser(null)
    setLoggedInPlayer(null)
    setCurrentView('userSelection')
    setLoginForm({ username: '', password: '' })
  }

  const addPlayer = () => {
    if (newPlayer.name && newPlayer.phone) {
      const player: Player = {
        id: Date.now().toString(),
        name: newPlayer.name,
        phone: newPlayer.phone,
        photo: newPlayer.photo || '',
        position: newPlayer.position || '',
        username: newPlayer.username || '',
        password: newPlayer.password || '',
        physicalMeasures: newPlayer.physicalMeasures!,
        speedTests: newPlayer.speedTests!,
        evolution: [{
          date: new Date().toISOString().split('T')[0],
          ...newPlayer.speedTests!
        }],
        registrationDate: new Date().toISOString().split('T')[0],
        paymentStatus: 'pending',
        gpsData: generateInitialGPSData()
      }
      setPlayers([...players, player])
      setNewPlayer({
        name: '',
        phone: '',
        photo: '',
        position: '',
        username: '',
        password: '',
        physicalMeasures: { height: 0, weight: 0, bodyFat: 0, muscleMass: 0 },
        speedTests: { ballControl: 0, sprint50m: 0, sprint100m: 0, endurance1km: 0 }
      })
      setShowPlayerForm(false)
    }
  }

  const updatePlayer = () => {
    if (editingPlayer && newPlayer.name && newPlayer.phone) {
      const updatedPlayer: Player = {
        ...editingPlayer,
        name: newPlayer.name,
        phone: newPlayer.phone,
        photo: newPlayer.photo || editingPlayer.photo || '',
        position: newPlayer.position || editingPlayer.position || '',
        username: newPlayer.username || editingPlayer.username || '',
        password: newPlayer.password || editingPlayer.password || '',
        physicalMeasures: newPlayer.physicalMeasures!,
        speedTests: newPlayer.speedTests!
      }
      
      setPlayers(players.map(p => p.id === editingPlayer.id ? updatedPlayer : p))
      setEditingPlayer(null)
      setNewPlayer({
        name: '',
        phone: '',
        photo: '',
        position: '',
        username: '',
        password: '',
        physicalMeasures: { height: 0, weight: 0, bodyFat: 0, muscleMass: 0 },
        speedTests: { ballControl: 0, sprint50m: 0, sprint100m: 0, endurance1km: 0 }
      })
      setShowPlayerForm(false)
    }
  }

  // Gerar dados GPS iniciais para simulação - REDUZIDOS
  const generateInitialGPSData = () => {
    const data = []
    // Reduzido de 100 para 30 pontos para economizar espaço
    for (let i = 0; i < 30; i++) {
      data.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        timestamp: Date.now() - Math.random() * 5400000,
        intensity: Math.random()
      })
    }
    return data
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, callback: (photoUrl: string) => void) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar se é PNG ou JPG
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        alert('Por favor, selecione apenas arquivos PNG ou JPG.')
        return
      }
      
      // Converter para base64 para persistência
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        callback(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTeamLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar se é PNG ou JPG
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        alert('Por favor, selecione apenas arquivos PNG ou JPG para o brasão.')
        return
      }
      
      // Converter para base64 para persistência
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setTeamSettings({
          ...teamSettings,
          teamLogo: base64
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const addStaffMember = (staff: Omit<TechnicalStaff, 'id'>) => {
    const newStaff: TechnicalStaff = {
      id: Date.now().toString(),
      ...staff
    }
    setTechnicalStaff([...technicalStaff, newStaff])
    setShowStaffForm(false)
  }

  const updateStaffMember = (staff: TechnicalStaff) => {
    setTechnicalStaff(technicalStaff.map(s => s.id === staff.id ? staff : s))
    setEditingStaff(null)
    setShowStaffForm(false)
  }

  const getPerformanceLevel = (value: number, test: keyof SpeedConfig) => {
    const config = speedConfig[test]
    if (test === 'ballControl') {
      if (value >= config.high) return 'Alto'
      if (value >= config.medium) return 'Médio'
      return 'Baixo'
    } else {
      if (value <= config.high) return 'Alto'
      if (value <= config.medium) return 'Médio'
      return 'Baixo'
    }
  }

  const getPerformanceColor = (value: number, test: keyof SpeedConfig) => {
    const level = getPerformanceLevel(value, test)
    switch (level) {
      case 'Alto': return 'text-green-600 bg-green-100'
      case 'Médio': return 'text-yellow-600 bg-yellow-100'
      case 'Baixo': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Componente do Campo de Futebol Corrigido com Base na Imagem Fornecida
  const SoccerFieldHeatMap = ({ player }: { player: Player }) => {
    // Gerar dados GPS realistas baseados na performance do jogador
    const generateRealisticGPSData = () => {
      const data = []
      const performance = (player.speedTests.ballControl + (10 - player.speedTests.sprint50m/2) + (15 - player.speedTests.sprint100m/3)) / 3
      
      // Padrões de movimento baseados em posições típicas do futebol
      const movementZones = [
        // Zona de meio-campo (mais ativa)
        { centerX: 50, centerY: 50, radius: 20, weight: 0.4, color: 'high' },
        // Zona de ataque
        { centerX: 75, centerY: 50, radius: 15, weight: 0.3, color: 'medium' },
        // Zona defensiva
        { centerX: 25, centerY: 50, radius: 12, weight: 0.2, color: 'medium' },
        // Laterais
        { centerX: 50, centerY: 20, radius: 8, weight: 0.1, color: 'low' },
        { centerX: 50, centerY: 80, radius: 8, weight: 0.1, color: 'low' }
      ]

      movementZones.forEach(zone => {
        // Reduzido de 80 para 20 pontos por zona
        const pointsCount = Math.floor(20 * zone.weight * (performance / 10))
        for (let i = 0; i < pointsCount; i++) {
          const angle = Math.random() * 2 * Math.PI
          const distance = Math.random() * zone.radius
          const x = Math.max(5, Math.min(95, zone.centerX + Math.cos(angle) * distance))
          const y = Math.max(5, Math.min(95, zone.centerY + Math.sin(angle) * distance))
          
          let intensity = 0.3
          if (zone.color === 'high') intensity = 0.7 + Math.random() * 0.3
          else if (zone.color === 'medium') intensity = 0.4 + Math.random() * 0.3
          else intensity = 0.1 + Math.random() * 0.3
          
          data.push({
            x,
            y,
            intensity,
            timestamp: Date.now() - Math.random() * 5400000
          })
        }
      })
      
      return data.sort((a, b) => a.timestamp - b.timestamp)
    }

    const heatMapData = player.gpsData || generateRealisticGPSData()
    
    // Calcular aspect ratio correto do campo (baseado na imagem fornecida)
    const aspectRatio = 1.5 // Proporção típica de campo de futebol

    return (
      <div className="relative w-full bg-green-600 rounded-lg overflow-hidden shadow-lg">
        {/* Container do campo com aspect ratio correto baseado na imagem */}
        <div 
          className="relative w-full"
          style={{ 
            aspectRatio: `${aspectRatio}`,
            minHeight: '300px'
          }}
        >
          {/* Fundo do campo - Verde como na imagem */}
          <div className="absolute inset-0 bg-green-600">
            {/* Padrão de grama sutil */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 20px,
                  rgba(255,255,255,0.1) 20px,
                  rgba(255,255,255,0.1) 40px
                )`
              }}></div>
            </div>
          </div>

          {/* Linhas do campo baseadas na imagem fornecida */}
          <div className="absolute inset-2 border-2 border-white">
            {/* Linha central vertical */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white transform -translate-x-0.5"></div>
            
            {/* Círculo central */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Grandes áreas (18 jardas) */}
            <div className="absolute top-1/4 left-0 w-12 h-1/2 border-2 border-white border-l-0"></div>
            <div className="absolute top-1/4 right-0 w-12 h-1/2 border-2 border-white border-r-0"></div>
            
            {/* Pequenas áreas (6 jardas) */}
            <div className="absolute top-1/3 left-0 w-6 h-1/3 border-2 border-white border-l-0"></div>
            <div className="absolute top-1/3 right-0 w-6 h-1/3 border-2 border-white border-r-0"></div>
            
            {/* Semicírculos das grandes áreas */}
            <div className="absolute top-1/2 left-12 w-8 h-8 border-2 border-white border-l-0 rounded-r-full transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-12 w-8 h-8 border-2 border-white border-r-0 rounded-l-full transform -translate-y-1/2"></div>
            
            {/* Pontos de pênalti */}
            <div className="absolute top-1/2 left-9 w-1 h-1 bg-white rounded-full transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-9 w-1 h-1 bg-white rounded-full transform -translate-y-1/2"></div>
            
            {/* Arcos dos cantos */}
            <div className="absolute top-0 left-0 w-4 h-4 border-b-2 border-r-2 border-white rounded-br-full"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr-full"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl-full"></div>
            
            {/* Gols */}
            <div className="absolute top-1/2 left-0 w-1 h-8 bg-white transform -translate-y-1/2 -translate-x-1"></div>
            <div className="absolute top-1/2 right-0 w-1 h-8 bg-white transform -translate-y-1/2 translate-x-1"></div>
          </div>

          {/* Pontos de calor GPS */}
          {heatMapData.map((point, index) => {
            const intensity = Math.min(point.intensity, 1)
            const age = (Date.now() - point.timestamp) / 5400000
            
            let color = `rgba(59, 130, 246, ${0.6 - age * 0.2})` // Azul
            let size = 4 + intensity * 6
            
            if (intensity > 0.4) {
              color = `rgba(251, 191, 36, ${0.8 - age * 0.2})` // Amarelo
              size = 6 + intensity * 8
            }
            if (intensity > 0.7) {
              color = `rgba(239, 68, 68, ${0.9 - age * 0.1})` // Vermelho
              size = 8 + intensity * 10
            }

            return (
              <div
                key={index}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  boxShadow: `0 0 ${size * 2}px ${color}`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: Math.floor(intensity * 10) + 10
                }}
              />
            )
          })}

          {/* Legenda do mapa de calor */}
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="text-xs font-medium mb-2 flex items-center">
              <Target className="w-3 h-3 mr-1" />
              GPS Tracking
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                <span className="text-xs">Baixa</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                <span className="text-xs">Média</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                <span className="text-xs">Alta</span>
              </div>
            </div>
            <div className="border-t border-white/30 pt-1 mt-2 text-xs">
              🔴 Ao vivo • {heatMapData.length} pontos
            </div>
          </div>

          {/* Info do campo */}
          <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white">
            <div className="text-sm font-medium flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-green-400" />
              {player.name}
            </div>
            <div className="text-xs opacity-80 mt-1">
              {fieldDimensions.length}m x {fieldDimensions.width}m
              {!fieldDimensions.useCustom && ' (FIFA)'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Componente de Formação Tática no Dashboard - INTERLIGADO COM CONFIGURAÇÕES
  const TacticalFormation = () => {
    const formations = getFormationForPlayers(teamSettings.playersPerTeam)
    const formation = formations[selectedFormation as keyof typeof formations] || Object.values(formations)[0]
    const maxPlayers = teamSettings.playersPerTeam
    const assignedPlayers = players.slice(0, maxPlayers) // Jogadores baseado na configuração

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Formação do Time ({maxPlayers}x{maxPlayers})</h3>
          <select
            value={selectedFormation}
            onChange={(e) => setSelectedFormation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {Object.keys(formations).map(formationKey => (
              <option key={formationKey} value={formationKey}>{formationKey}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full bg-green-600 rounded-lg overflow-hidden" style={{ aspectRatio: '1.5', minHeight: '400px' }}>
          {/* Fundo do campo */}
          <div className="absolute inset-0 bg-green-600">
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 20px,
                  rgba(255,255,255,0.1) 20px,
                  rgba(255,255,255,0.1) 40px
                )`
              }}></div>
            </div>
          </div>

          {/* Linhas do campo simplificadas */}
          <div className="absolute inset-2 border-2 border-white">
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white transform -translate-x-0.5"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/4 left-0 w-12 h-1/2 border-2 border-white border-l-0"></div>
            <div className="absolute top-1/4 right-0 w-12 h-1/2 border-2 border-white border-r-0"></div>
          </div>

          {/* Jogadores na formação */}
          {formation.map((pos, index) => {
            const player = assignedPlayers[index]
            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`
                }}
              >
                <div className="flex flex-col items-center">
                  {player ? (
                    <>
                      {player.photo ? (
                        <img
                          src={player.photo}
                          alt={player.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/90 border-2 border-white shadow-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                      )}
                      <div className="mt-1 text-center">
                        <div className="text-xs font-bold text-white bg-black/70 px-2 py-1 rounded">
                          {player.name.split(' ')[0]}
                        </div>
                        <div className="text-xs text-white bg-green-700/80 px-1 rounded mt-1">
                          {pos.position}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-gray-300/80 border-2 border-white shadow-lg flex items-center justify-center">
                        <Plus className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="mt-1 text-center">
                        <div className="text-xs font-bold text-white bg-black/70 px-2 py-1 rounded">
                          Vago
                        </div>
                        <div className="text-xs text-white bg-gray-700/80 px-1 rounded mt-1">
                          {pos.position}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Formação:</strong> {selectedFormation}</p>
          <p><strong>Jogadores Escalados:</strong> {Math.min(assignedPlayers.length, maxPlayers)}/{maxPlayers}</p>
          <p><strong>Modalidade:</strong> {maxPlayers}x{maxPlayers}</p>
          {assignedPlayers.length < maxPlayers && (
            <p className="text-yellow-600 mt-2">
              ⚠️ Cadastre mais jogadores para completar a formação {maxPlayers}x{maxPlayers}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Tela de Seleção de Tipo de Usuário
  if (currentView === 'userSelection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center p-4 relative">
        {/* Brasão do time em segundo plano */}
        {teamSettings.teamLogo && (
          <div 
            className="fixed inset-0 bg-center bg-no-repeat bg-contain opacity-15 pointer-events-none z-0"
            style={{ 
              backgroundImage: `url(${teamSettings.teamLogo})`,
              backgroundSize: '50%',
              backgroundPosition: 'center center'
            }}
          />
        )}

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20 relative z-10">
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {teamSettings.teamLogo ? (
                <img 
                  src={teamSettings.teamLogo} 
                  alt="Emblema do Time" 
                  className="w-20 h-20 object-contain"
                />
              ) : (
                <Trophy className="w-20 h-20 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{teamSettings.teamName}</h1>
            <p className="text-white/80">Sistema de Gestão de Atletas</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white text-center mb-6">Selecione seu tipo de acesso:</h2>
            
            <button
              onClick={() => handleUserTypeSelection('admin')}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center space-x-3"
            >
              <Shield className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold">ADMINISTRADOR</div>
                <div className="text-sm opacity-80">Acesso completo ao sistema</div>
              </div>
            </button>

            <button
              onClick={() => handleUserTypeSelection('athlete')}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center space-x-3"
            >
              <UserCheck className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold">ATLETA</div>
                <div className="text-sm opacity-80">Visualizar apenas seus dados</div>
              </div>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-xs">
              Escolha o tipo de acesso adequado para continuar
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center p-4 relative">
        {/* Brasão do time em segundo plano */}
        {teamSettings.teamLogo && (
          <div 
            className="fixed inset-0 bg-center bg-no-repeat bg-contain opacity-15 pointer-events-none z-0"
            style={{ 
              backgroundImage: `url(${teamSettings.teamLogo})`,
              backgroundSize: '50%',
              backgroundPosition: 'center center'
            }}
          />
        )}

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20 relative z-10">
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {userType === 'admin' ? (
                <Shield className="w-20 h-20 text-white" />
              ) : (
                <UserCheck className="w-20 h-20 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {userType === 'admin' ? 'Administrador' : 'Atleta'}
            </h1>
            <p className="text-white/80">
              {userType === 'admin' ? 'Acesso completo ao sistema' : 'Visualize seus dados pessoais'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Digite seu usuário"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              Entrar
            </button>
          </div>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => setCurrentView('userSelection')}
              className="text-white/80 hover:text-white text-sm underline"
            >
              ← Voltar à seleção de tipo
            </button>
            
            <div className="border-t border-white/20 pt-4">
              {userType === 'admin' ? (
                <p className="text-white/60 text-xs">
                  <strong>Credenciais:</strong> admin / admin123
                </p>
              ) : (
                <p className="text-white/60 text-xs">
                  <strong>Credenciais padrão:</strong> jogador / jogador123<br/>
                  Ou use as credenciais fornecidas pelo administrador
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 relative">
      {/* Brasão do time em segundo plano */}
      {teamSettings.teamLogo && (
        <div 
          className="fixed inset-0 bg-center bg-no-repeat bg-contain opacity-10 pointer-events-none z-0"
          style={{ 
            backgroundImage: `url(${teamSettings.teamLogo})`,
            backgroundSize: '40%',
            backgroundPosition: 'center center'
          }}
        />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {teamSettings.teamLogo ? (
                <img 
                  src={teamSettings.teamLogo} 
                  alt="Brasão do Time" 
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <Trophy className="w-16 h-16 text-green-600" />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{teamSettings.teamName}</h1>
                {currentUser === 'player' && loggedInPlayer && (
                  <p className="text-sm text-green-600">Bem-vindo, {loggedInPlayer.name}</p>
                )}
              </div>
            </div>
            
            {currentUser === 'admin' && (
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'dashboard' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('players')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'players' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Jogadores
                </button>
                <button
                  onClick={() => setCurrentView('settings')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'settings' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Configurações
                </button>
                <button
                  onClick={() => setCurrentView('payment')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'payment' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Pagamentos
                </button>
                <button
                  onClick={() => setCurrentView('manual')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'manual' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Manual
                </button>
              </nav>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Dashboard */}
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentUser === 'admin' ? 'Painel Administrativo' : 'Meu Perfil'}
              </h2>
              <p className="text-gray-600">
                {currentUser === 'admin' ? 'Gerencie seus atletas e equipe técnica' : 'Acompanhe seu desempenho'}
              </p>
            </div>

            {/* Stats Cards - ADMIN vê tudo, ATLETA vê apenas seus dados */}
            {currentUser === 'admin' ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Atletas</p>
                      <p className="text-3xl font-bold text-green-600">{players.length}</p>
                    </div>
                    <Users className="w-12 h-12 text-green-500" />
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pagamentos Pendentes</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {players.filter(p => p.paymentStatus === 'pending').length}
                      </p>
                    </div>
                    <CreditCard className="w-12 h-12 text-yellow-500" />
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                      <p className="text-3xl font-bold text-blue-600">
                        R$ {players.filter(p => p.paymentStatus === 'paid').length * 10}
                      </p>
                    </div>
                    <Trophy className="w-12 h-12 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Comissão Técnica</p>
                      <p className="text-3xl font-bold text-purple-600">{technicalStaff.length}</p>
                    </div>
                    <Activity className="w-12 h-12 text-purple-500" />
                  </div>
                </div>
              </div>
            ) : (
              // ATLETA - Apenas seus dados pessoais
              loggedInPlayer && (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Meus Dados</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        {loggedInPlayer.photo ? (
                          <img
                            src={loggedInPlayer.photo}
                            alt={loggedInPlayer.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-green-200"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                            <User className="w-10 h-10 text-green-600" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{loggedInPlayer.name}</h4>
                          <p className="text-sm text-gray-600">{loggedInPlayer.phone}</p>
                          {loggedInPlayer.position && (
                            <p className="text-sm text-green-600 font-medium">{loggedInPlayer.position}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Medidas Físicas</h5>
                        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Altura</p>
                            <p className="font-semibold">{loggedInPlayer.physicalMeasures.height} cm</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Peso</p>
                            <p className="font-semibold">{loggedInPlayer.physicalMeasures.weight} kg</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Gordura</p>
                            <p className="font-semibold">{loggedInPlayer.physicalMeasures.bodyFat}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Massa Muscular</p>
                            <p className="font-semibold">{loggedInPlayer.physicalMeasures.muscleMass} kg</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Minha Performance</h5>
                      <div className="space-y-3">
                        <div className={`p-3 rounded-lg ${getPerformanceColor(loggedInPlayer.speedTests.ballControl, 'ballControl')}`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Domínio de Bola</span>
                            <span className="font-bold">{loggedInPlayer.speedTests.ballControl}/10</span>
                          </div>
                          <p className="text-xs mt-1">
                            Nível: {getPerformanceLevel(loggedInPlayer.speedTests.ballControl, 'ballControl')}
                          </p>
                        </div>

                        <div className={`p-3 rounded-lg ${getPerformanceColor(loggedInPlayer.speedTests.sprint50m, 'sprint50m')}`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Corrida 50m</span>
                            <span className="font-bold">{loggedInPlayer.speedTests.sprint50m}s</span>
                          </div>
                          <p className="text-xs mt-1">
                            Nível: {getPerformanceLevel(loggedInPlayer.speedTests.sprint50m, 'sprint50m')}
                          </p>
                        </div>

                        <div className={`p-3 rounded-lg ${getPerformanceColor(loggedInPlayer.speedTests.sprint100m, 'sprint100m')}`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Corrida 100m</span>
                            <span className="font-bold">{loggedInPlayer.speedTests.sprint100m}s</span>
                          </div>
                          <p className="text-xs mt-1">
                            Nível: {getPerformanceLevel(loggedInPlayer.speedTests.sprint100m, 'sprint100m')}
                          </p>
                        </div>

                        <div className={`p-3 rounded-lg ${getPerformanceColor(loggedInPlayer.speedTests.endurance1km, 'endurance1km')}`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Resistência 1km</span>
                            <span className="font-bold">{loggedInPlayer.speedTests.endurance1km} min</span>
                          </div>
                          <p className="text-xs mt-1">
                            Nível: {getPerformanceLevel(loggedInPlayer.speedTests.endurance1km, 'endurance1km')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campo de Futebol com Mapa de Calor GPS - APENAS SEUS DADOS */}
                  <div className="mt-6">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-green-600" />
                      Minha Movimentação em Campo
                    </h5>
                    <SoccerFieldHeatMap player={loggedInPlayer} />
                  </div>
                </div>
              )
            )}

            {/* FORMAÇÃO DO TIME NO DASHBOARD - APENAS ADMIN */}
            {currentUser === 'admin' && <TacticalFormation />}

            {/* Technical Staff - APENAS ADMIN */}
            {currentUser === 'admin' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Comissão Técnica</h3>
                  <button
                    onClick={() => setShowStaffForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {technicalStaff.map((staff) => (
                    <div key={staff.id} className="text-center">
                      <div className="relative">
                        <img
                          src={staff.photo}
                          alt={staff.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-green-200"
                        />
                        <button
                          onClick={() => {
                            setEditingStaff(staff)
                            setShowStaffForm(true)
                          }}
                          className="absolute top-0 right-1/2 transform translate-x-8 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                      <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                      <p className="text-sm text-gray-600">{staff.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Players Management - APENAS ADMIN */}
        {currentView === 'players' && currentUser === 'admin' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Jogadores</h2>
              <button
                onClick={() => setShowPlayerForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Cadastrar Jogador</span>
              </button>
            </div>

            {/* OPÇÕES DE TREINO, PARTIDA AMISTOSA E CAMPEONATO */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerenciar Todos os Atletas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setCurrentView('training')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Activity className="w-5 h-5" />
                  <span>Treino</span>
                </button>
                <button
                  onClick={() => setCurrentView('friendly')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Partida Amistosa</span>
                </button>
                <button
                  onClick={() => setCurrentView('championship')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Award className="w-5 h-5" />
                  <span>Campeonato</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {players.map((player) => (
                <div key={player.id} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      {player.photo ? (
                        <img
                          src={player.photo}
                          alt={player.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {player.phone}
                        </p>
                        {player.position && (
                          <p className="text-sm text-green-600 font-medium">{player.position}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedPlayer(player)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPlayer(player)
                          setNewPlayer({
                            name: player.name,
                            phone: player.phone,
                            photo: player.photo || '',
                            position: player.position || '',
                            username: player.username || '',
                            password: player.password || '',
                            physicalMeasures: player.physicalMeasures,
                            speedTests: player.speedTests
                          })
                          setShowPlayerForm(true)
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        player.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        player.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {player.paymentStatus === 'paid' ? 'Pago' :
                         player.paymentStatus === 'pending' ? 'Pendente' : 'Atrasado'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-600">Altura: {player.physicalMeasures.height}cm</p>
                      <p className="text-gray-600">Peso: {player.physicalMeasures.weight}kg</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Gordura: {player.physicalMeasures.bodyFat}%</p>
                      <p className="text-gray-600">Massa: {player.physicalMeasures.muscleMass}kg</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className={`px-2 py-1 rounded text-xs text-center ${getPerformanceColor(player.speedTests.ballControl, 'ballControl')}`}>
                      Domínio: {player.speedTests.ballControl}/10
                    </div>
                    <div className={`px-2 py-1 rounded text-xs text-center ${getPerformanceColor(player.speedTests.sprint50m, 'sprint50m')}`}>
                      50m: {player.speedTests.sprint50m}s
                    </div>
                    <div className={`px-2 py-1 rounded text-xs text-center ${getPerformanceColor(player.speedTests.sprint100m, 'sprint100m')}`}>
                      100m: {player.speedTests.sprint100m}s
                    </div>
                    <div className={`px-2 py-1 rounded text-xs text-center ${getPerformanceColor(player.speedTests.endurance1km, 'endurance1km')}`}>
                      1km: {player.speedTests.endurance1km}min
                    </div>
                  </div>

                  {/* Campo de Futebol com Mapa de Calor GPS Corrigido */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-green-600" />
                      Rastreamento GPS - Movimentação em Campo
                    </h4>
                    <SoccerFieldHeatMap player={player} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Training View - APENAS ADMIN */}
        {currentView === 'training' && currentUser === 'admin' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={() => setCurrentView('players')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Voltar
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Modo Treino</h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Configurações de Treino</h3>
              <p className="text-blue-800 mb-4">
                Configure os parâmetros de treino que serão aplicados a todos os atletas simultaneamente.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">Duração do Treino</label>
                  <select className="w-full px-3 py-2 border border-blue-300 rounded-lg">
                    <option>60 minutos</option>
                    <option>90 minutos</option>
                    <option>120 minutos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">Intensidade</label>
                  <select className="w-full px-3 py-2 border border-blue-300 rounded-lg">
                    <option>Baixa</option>
                    <option>Média</option>
                    <option>Alta</option>
                  </select>
                </div>
              </div>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Aplicar a Todos os Atletas
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div key={player.id} className="bg-white rounded-lg p-4 shadow border">
                  <div className="flex items-center space-x-3 mb-3">
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{player.name}</h4>
                      <p className="text-sm text-gray-600">{player.position || 'Posição não definida'}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Status: <span className="text-blue-600 font-medium">Pronto para treino</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friendly Match View - APENAS ADMIN */}
        {currentView === 'friendly' && currentUser === 'admin' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={() => setCurrentView('players')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Voltar
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Partida Amistosa</h2>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Configurações da Partida</h3>
              <p className="text-yellow-800 mb-4">
                Configure os parâmetros da partida amistosa para todos os atletas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-900 mb-2">Adversário</label>
                  <input type="text" placeholder="Nome do time adversário" className="w-full px-3 py-2 border border-yellow-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-900 mb-2">Data</label>
                  <input type="date" className="w-full px-3 py-2 border border-yellow-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-900 mb-2">Local</label>
                  <input type="text" placeholder="Local da partida" className="w-full px-3 py-2 border border-yellow-300 rounded-lg" />
                </div>
              </div>
              <button className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg">
                Convocar Todos os Atletas
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div key={player.id} className="bg-white rounded-lg p-4 shadow border">
                  <div className="flex items-center space-x-3 mb-3">
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-yellow-600" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{player.name}</h4>
                      <p className="text-sm text-gray-600">{player.position || 'Posição não definida'}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Status: <span className="text-yellow-600 font-medium">Convocado</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Championship View - APENAS ADMIN */}
        {currentView === 'championship' && currentUser === 'admin' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={() => setCurrentView('players')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Voltar
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Campeonato</h2>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Configurações do Campeonato</h3>
              <p className="text-purple-800 mb-4">
                Configure os parâmetros do campeonato para todos os atletas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-900 mb-2">Nome do Campeonato</label>
                  <input type="text" placeholder="Ex: Copa Regional 2024" className="w-full px-3 py-2 border border-purple-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-900 mb-2">Categoria</label>
                  <select className="w-full px-3 py-2 border border-purple-300 rounded-lg">
                    <option>Amador</option>
                    <option>Semi-profissional</option>
                    <option>Profissional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-900 mb-2">Data de Início</label>
                  <input type="date" className="w-full px-3 py-2 border border-purple-300 rounded-lg" />
                </div>
              </div>
              <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
                Inscrever Todos os Atletas
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div key={player.id} className="bg-white rounded-lg p-4 shadow border">
                  <div className="flex items-center space-x-3 mb-3">
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{player.name}</h4>
                      <p className="text-sm text-gray-600">{player.position || 'Posição não definida'}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Status: <span className="text-purple-600 font-medium">Inscrito</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings - APENAS ADMIN */}
        {currentView === 'settings' && currentUser === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>

            {/* Configurações de Quantidade de Jogadores por Time */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Quantidade de Jogadores por Time
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Configure quantos jogadores cada time terá em campo. Ideal para times amadores que jogam 5x5, 6x6, 7x7, etc.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jogadores por Time
                  </label>
                  <select
                    value={teamSettings.playersPerTeam}
                    onChange={(e) => setTeamSettings({
                      ...teamSettings,
                      playersPerTeam: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value={5}>5x5 (Futsal/Society)</option>
                    <option value={6}>6x6 (Mini Campo)</option>
                    <option value={7}>7x7 (Society)</option>
                    <option value={8}>8x8 (Campo Reduzido)</option>
                    <option value={9}>9x9 (Campo Médio)</option>
                    <option value={10}>10x10 (Quase Oficial)</option>
                    <option value={11}>11x11 (Oficial FIFA)</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">⚽ Configuração Atual</h4>
                  <p className="text-blue-800">
                    <strong>Modalidade:</strong> {teamSettings.playersPerTeam}x{teamSettings.playersPerTeam}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    {teamSettings.playersPerTeam === 5 && "Futsal ou Society - Ideal para quadras cobertas"}
                    {teamSettings.playersPerTeam === 6 && "Mini Campo - Perfeito para campos pequenos"}
                    {teamSettings.playersPerTeam === 7 && "Society - Modalidade muito popular em times amadores"}
                    {teamSettings.playersPerTeam === 8 && "Campo Reduzido - Bom para treinos e jogos rápidos"}
                    {teamSettings.playersPerTeam === 9 && "Campo Médio - Transição para o futebol oficial"}
                    {teamSettings.playersPerTeam === 10 && "Quase Oficial - Próximo ao futebol tradicional"}
                    {teamSettings.playersPerTeam === 11 && "Futebol Oficial FIFA - Padrão internacional"}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">🏟️ Para Times Amadores</h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• <strong>5x5:</strong> Futsal, quadras cobertas, society pequeno</li>
                    <li>• <strong>6x6:</strong> Mini campos, espaços reduzidos</li>
                    <li>• <strong>7x7:</strong> Society tradicional, muito popular</li>
                    <li>• <strong>8x8:</strong> Campos médios, treinos intensivos</li>
                    <li>• <strong>9x9 a 11x11:</strong> Campos grandes, futebol tradicional</li>
                    <li>• O sistema se adapta automaticamente à quantidade escolhida!</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Configurações do Brasão do Time */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-green-600" />
                Brasão do Time
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Adicione o brasão do seu time. Ele aparecerá em segundo plano em todas as páginas.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Time
                  </label>
                  <input
                    type="text"
                    value={teamSettings.teamName}
                    onChange={(e) => setTeamSettings({
                      ...teamSettings,
                      teamName: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nome do seu time"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brasão do Time (PNG ou JPG)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={handleTeamLogoUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    <p className="text-xs text-gray-500">
                      Selecione uma imagem PNG ou JPG do brasão do seu time
                    </p>
                    
                    {teamSettings.teamLogo && (
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                          src={teamSettings.teamLogo} 
                          alt="Preview do Brasão" 
                          className="w-16 h-16 object-contain border border-gray-200 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Brasão carregado com sucesso!</p>
                          <p className="text-xs text-gray-600">Este brasão aparecerá em segundo plano em todas as páginas</p>
                          <button
                            onClick={() => setTeamSettings({
                              ...teamSettings,
                              teamLogo: ''
                            })}
                            className="text-red-600 hover:text-red-800 text-xs mt-1"
                          >
                            Remover brasão
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Configurações de Dimensões do Campo */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Ruler className="w-5 h-5 mr-2 text-green-600" />
                Dimensões do Campo (Livre para Times Amadores)
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Configure as dimensões do campo conforme sua realidade. Times amadores podem usar campos de várias dimensões.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="useCustomField"
                    checked={fieldDimensions.useCustom}
                    onChange={(e) => setFieldDimensions({
                      ...fieldDimensions,
                      useCustom: e.target.checked
                    })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="useCustomField" className="text-sm font-medium text-gray-700">
                    Usar dimensões personalizadas (não FIFA) - Ideal para times amadores
                  </label>
                </div>

                {fieldDimensions.useCustom && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comprimento (metros)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="150"
                        value={fieldDimensions.length}
                        onChange={(e) => setFieldDimensions({
                          ...fieldDimensions,
                          length: parseInt(e.target.value) || 105
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="105"
                      />
                      <p className="text-xs text-gray-500 mt-1">FIFA: 100-110m | Amador: 50-150m (livre)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Largura (metros)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="100"
                        value={fieldDimensions.width}
                        onChange={(e) => setFieldDimensions({
                          ...fieldDimensions,
                          width: parseInt(e.target.value) || 68
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="68"
                      />
                      <p className="text-xs text-gray-500 mt-1">FIFA: 64-75m | Amador: 30-100m (livre)</p>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">📏 Dimensões Atuais</h4>
                  <p className="text-blue-800">
                    <strong>Campo:</strong> {fieldDimensions.length}m x {fieldDimensions.width}m
                    {!fieldDimensions.useCustom && ' (Padrão FIFA)'}
                    {fieldDimensions.useCustom && ' (Personalizado para Time Amador)'}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    Área total: {(fieldDimensions.length * fieldDimensions.width / 10000).toFixed(2)} hectares
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">🏟️ Para Times Amadores</h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Campos de várzea: geralmente 80-90m x 45-55m</li>
                    <li>• Quadras cobertas: 40-60m x 20-40m</li>
                    <li>• Society: 30-40m x 20-25m</li>
                    <li>• Futsal: 25-42m x 16-25m</li>
                    <li>• O sistema se adapta automaticamente a qualquer dimensão!</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Configurações de Velocidade */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Velocidade</h3>
              <p className="text-sm text-gray-600 mb-6">
                Defina os parâmetros para classificar o desempenho dos atletas
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(speedConfig).map(([test, config]) => (
                  <div key={test} className="space-y-3">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {test === 'ballControl' ? 'Domínio de Bola (1-10)' :
                       test === 'sprint50m' ? 'Corrida 50m (segundos)' :
                       test === 'sprint100m' ? 'Corrida 100m (segundos)' :
                       'Resistência 1km (minutos)'}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Baixo</label>
                        <input
                          type="number"
                          step="0.1"
                          value={config.low}
                          onChange={(e) => setSpeedConfig({
                            ...speedConfig,
                            [test]: { ...config, low: parseFloat(e.target.value) }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Médio</label>
                        <input
                          type="number"
                          step="0.1"
                          value={config.medium}
                          onChange={(e) => setSpeedConfig({
                            ...speedConfig,
                            [test]: { ...config, medium: parseFloat(e.target.value) }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Alto</label>
                        <input
                          type="number"
                          step="0.1"
                          value={config.high}
                          onChange={(e) => setSpeedConfig({
                            ...speedConfig,
                            [test]: { ...config, high: parseFloat(e.target.value) }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payment Management - APENAS ADMIN */}
        {currentView === 'payment' && currentUser === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestão de Pagamentos</h2>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    R$ {players.filter(p => p.paymentStatus === 'paid').length * 10}
                  </p>
                  <p className="text-sm text-gray-600">Receita Atual</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    R$ {players.filter(p => p.paymentStatus === 'pending').length * 10}
                  </p>
                  <p className="text-sm text-gray-600">Pendente</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">
                    R$ {players.filter(p => p.paymentStatus === 'overdue').length * 10}
                  </p>
                  <p className="text-sm text-gray-600">Em Atraso</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Status dos Pagamentos</h4>
                {players.map((player) => (
                  <div key={player.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{player.name}</p>
                      <p className="text-sm text-gray-600">{player.phone}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">R$ 10,00</span>
                      <select
                        value={player.paymentStatus}
                        onChange={(e) => {
                          const updatedPlayers = players.map(p =>
                            p.id === player.id
                              ? { ...p, paymentStatus: e.target.value as Player['paymentStatus'] }
                              : p
                          )
                          setPlayers(updatedPlayers)
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${
                          player.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          player.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="pending">Pendente</option>
                        <option value="paid">Pago</option>
                        <option value="overdue">Atrasado</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">💱 Integração com Banco de Dados via Celular</h3>
              <p className="text-blue-800 mb-4">
                <strong>Como os celulares dos atletas alimentarão o banco de dados:</strong>
              </p>
              <ul className="list-disc list-inside text-blue-800 space-y-2 text-sm">
                <li><strong>App Mobile:</strong> Cada atleta terá acesso via app com suas credenciais de login</li>
                <li><strong>Sincronização Automática:</strong> Dados GPS, treinos e performance são enviados automaticamente</li>
                <li><strong>Notificações Push:</strong> Lembretes de pagamento, convocações e atualizações</li>
                <li><strong>Offline First:</strong> App funciona offline e sincroniza quando há conexão</li>
                <li><strong>Pagamentos Mobile:</strong> Integração com PIX, cartão e Google Pay</li>
                <li><strong>Geolocalização:</strong> Rastreamento de presença em treinos e jogos</li>
                <li><strong>Biometria:</strong> Login seguro com impressão digital ou reconhecimento facial</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-blue-900 text-sm">
                  <strong>📱 Tecnologias necessárias:</strong> React Native, Firebase, Google Maps API, 
                  Payment Gateway (Stripe/PagSeguro), Push Notifications, SQLite local
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Manual - APENAS ADMIN */}
        {currentView === 'manual' && currentUser === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Manual de Instruções</h2>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guia do Administrador</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">1. Sistema de Controle de Acesso Implementado</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm ml-4">
                    <li><strong>Tela de Seleção:</strong> Usuário escolhe entre ADMINISTRADOR ou ATLETA</li>
                    <li><strong>Login Administrador:</strong> Acesso completo com admin/admin123</li>
                    <li><strong>Login Atleta:</strong> Acesso restrito usando credenciais cadastradas pelo admin</li>
                    <li><strong>Permissões Diferenciadas:</strong> Admin vê tudo, atleta vê apenas seus dados</li>
                    <li><strong>Segurança:</strong> Atletas não podem ver dados de outros atletas</li>
                    <li><strong>Interface Adaptativa:</strong> Dashboard muda conforme tipo de usuário</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">2. Correção Crítica - LocalStorage Otimizado</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm ml-4">
                    <li><strong>Problema Resolvido:</strong> QuotaExceededError que quebrava o sistema</li>
                    <li><strong>Proteção Automática:</strong> Sistema detecta quando localStorage está cheio</li>
                    <li><strong>Compressão Inteligente:</strong> Reduz dados GPS de 100 para 30 pontos por jogador</li>
                    <li><strong>Limpeza Automática:</strong> Remove dados antigos quando necessário</li>
                    <li><strong>Fallback Seguro:</strong> Mantém dados essenciais mesmo em caso de erro</li>
                    <li><strong>Dados Preservados:</strong> Informações críticas nunca são perdidas</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">3. Sistema de Formações Dinâmicas</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm ml-4">
                    <li><strong>5x5:</strong> Formações 2-1-1 e 1-2-1 (Futsal/Society)</li>
                    <li><strong>6x6:</strong> Formações 2-2-1 e 1-3-1 (Mini Campo)</li>
                    <li><strong>7x7:</strong> Formações 3-2-1 e 2-3-1 (Society)</li>
                    <li><strong>8x8:</strong> Formações 3-3-1 e 2-4-1 (Campo Reduzido)</li>
                    <li><strong>9x9:</strong> Formações 3-4-1 e 2-5-1 (Campo Médio)</li>
                    <li><strong>10x10:</strong> Formações 4-4-1 e 3-5-1 (Quase Oficial)</li>
                    <li><strong>11x11:</strong> Formações 4-4-2, 4-3-3 e 3-5-2 (Oficial FIFA)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">4. Interligação Dashboard ↔ Configurações</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm ml-4">
                    <li><strong>Configuração Automática:</strong> Mudança em Configurações atualiza Dashboard instantaneamente</li>
                    <li><strong>Formações Adaptáveis:</strong> Sistema escolhe formações compatíveis com quantidade de jogadores</li>
                    <li><strong>Validação Inteligente:</strong> Avisa quando faltam jogadores para completar formação</li>
                    <li><strong>Persistência:</strong> Configurações salvas automaticamente no localStorage</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">5. Gestão Coletiva de Atletas</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm ml-4">
                    <li><strong>Treino:</strong> Configure duração e intensidade para todos simultaneamente</li>
                    <li><strong>Partida Amistosa:</strong> Defina adversário, data e local - convoque todos</li>
                    <li><strong>Campeonato:</strong> Inscreva todos os atletas em competições oficiais</li>
                    <li><strong>Status Coletivo:</strong> Visualize status de todos os jogadores por categoria</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">6. Campo de Futebol Corrigido</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm ml-4">
                    <li><strong>Baseado na Imagem:</strong> Proporções e linhas conforme imagem fornecida</li>
                    <li><strong>Aspect Ratio 1.5:1:</strong> Proporção típica de campo de futebol</li>
                    <li><strong>Linhas Detalhadas:</strong> Grandes áreas, pequenas áreas, círculo central, gols</li>
                    <li><strong>GPS Otimizado:</strong> Pontos de calor reduzidos para melhor performance</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ Sistema de Controle de Acesso Completo</h4>
                  <ul className="list-disc list-inside text-green-700 space-y-1 text-sm ml-4">
                    <li><strong>Administrador:</strong> Acesso total - gerencia jogadores, configurações, pagamentos</li>
                    <li><strong>Atleta:</strong> Acesso restrito - vê apenas seus próprios dados e performance</li>
                    <li><strong>Segurança:</strong> Cada atleta precisa de credenciais únicas cadastradas pelo admin</li>
                    <li><strong>Interface Adaptativa:</strong> Dashboard e navegação mudam conforme tipo de usuário</li>
                    <li><strong>Proteção de Dados:</strong> Atletas não conseguem ver dados de outros atletas</li>
                    <li><strong>Login Seguro:</strong> Validação de credenciais com feedback claro de erros</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">📱 Próximos Passos - App Mobile</h4>
                  <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm ml-4">
                    <li><strong>Desenvolvimento:</strong> React Native + Firebase para dados em tempo real</li>
                    <li><strong>GPS Nativo:</strong> Rastreamento automático durante treinos e jogos</li>
                    <li><strong>Pagamentos:</strong> Gateway de pagamento integrado (PagSeguro/Stripe)</li>
                    <li><strong>Biometria:</strong> Login seguro com impressão digital</li>
                    <li><strong>Push Notifications:</strong> Convocações e lembretes automáticos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Player Registration Modal - APENAS ADMIN */}
      {showPlayerForm && currentUser === 'admin' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingPlayer ? 'Editar Jogador' : 'Cadastrar Novo Jogador'}
              </h3>
              <button
                onClick={() => {
                  setShowPlayerForm(false)
                  setEditingPlayer(null)
                  setNewPlayer({
                    name: '',
                    phone: '',
                    photo: '',
                    position: '',
                    username: '',
                    password: '',
                    physicalMeasures: { height: 0, weight: 0, bodyFat: 0, muscleMass: 0 },
                    speedTests: { ballControl: 0, sprint50m: 0, sprint100m: 0, endurance1km: 0 }
                  })
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Dados Pessoais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={newPlayer.name || ''}
                      onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="tel"
                      value={newPlayer.phone || ''}
                      onChange={(e) => setNewPlayer({...newPlayer, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posição</label>
                    <select
                      value={newPlayer.position || ''}
                      onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecione a posição</option>
                      <option value="Goleiro">Goleiro</option>
                      <option value="Zagueiro">Zagueiro</option>
                      <option value="Lateral Direito">Lateral Direito</option>
                      <option value="Lateral Esquerdo">Lateral Esquerdo</option>
                      <option value="Volante">Volante</option>
                      <option value="Meio-campo">Meio-campo</option>
                      <option value="Meia Atacante">Meia Atacante</option>
                      <option value="Ponta Direita">Ponta Direita</option>
                      <option value="Ponta Esquerda">Ponta Esquerda</option>
                      <option value="Centroavante">Centroavante</option>
                      <option value="Atacante">Atacante</option>
                    </select>
                  </div>
                </div>
                
                {/* Credenciais de Login */}
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-3">Credenciais de Acesso</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                      <input
                        type="text"
                        value={newPlayer.username || ''}
                        onChange={(e) => setNewPlayer({...newPlayer, username: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ex: joao.silva"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                      <input
                        type="password"
                        value={newPlayer.password || ''}
                        onChange={(e) => setNewPlayer({...newPlayer, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Senha para o atleta"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    O atleta usará essas credenciais para acessar o sistema
                  </p>
                </div>
                
                {/* Foto do Jogador */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto do Jogador (PNG ou JPG)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={(e) => handlePhotoUpload(e, (photoUrl) => {
                        setNewPlayer({...newPlayer, photo: photoUrl})
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    <p className="text-xs text-gray-500">
                      Selecione uma foto PNG ou JPG do jogador
                    </p>
                    
                    {newPlayer.photo && (
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                          src={newPlayer.photo} 
                          alt="Preview da Foto" 
                          className="w-16 h-16 object-cover rounded-full border border-gray-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Foto carregada com sucesso!</p>
                          <p className="text-xs text-gray-600">A foto será salva junto com os dados do jogador</p>
                          <button
                            onClick={() => setNewPlayer({...newPlayer, photo: ''})}
                            className="text-red-600 hover:text-red-800 text-xs mt-1"
                          >
                            Remover foto
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Physical Measures */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Medidas Físicas</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                    <input
                      type="number"
                      value={newPlayer.physicalMeasures?.height || ''}
                      onChange={(e) => setNewPlayer({
                        ...newPlayer,
                        physicalMeasures: {
                          ...newPlayer.physicalMeasures!,
                          height: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPlayer.physicalMeasures?.weight || ''}
                      onChange={(e) => setNewPlayer({
                        ...newPlayer,
                        physicalMeasures: {
                          ...newPlayer.physicalMeasures!,
                          weight: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gordura (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPlayer.physicalMeasures?.bodyFat || ''}
                      onChange={(e) => setNewPlayer({
                        ...newPlayer,
                        physicalMeasures: {
                          ...newPlayer.physicalMeasures!,
                          bodyFat: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Massa Muscular (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPlayer.physicalMeasures?.muscleMass || ''}
                      onChange={(e) => setNewPlayer({
                        ...newPlayer,
                        physicalMeasures: {
                          ...newPlayer.physicalMeasures!,
                          muscleMass: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Speed Tests */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Testes de Velocidade</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domínio de Bola (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newPlayer.speedTests?.ballControl || ''}
                      onChange={(e) => setNewPlayer({
                        ...newPlayer,
                        speedTests: {
                          ...newPlayer.speedTests!,
                          ballControl: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Corrida 50m (seg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPlayer.speedTests?.sprint50m || ''}
                      onChange={(e) => setNewPlayer({
                        ...newPlayer,
                        speedTests: {
                          ...newPlayer.speedTests!,
                          sprint50m: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Corrida 100m (seg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPlayer.speedTests?.sprint100m || ''}
                      onChange={(e) => setNewPlayer({
                        ...newPlayer,
                        speedTests: {
                          ...newPlayer.speedTests!,
                          sprint100m: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resistência 1km (min)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPlayer.speedTests?.endurance1km || ''}
                      onChange={(e) => setNewPlayer({
                        ...newPlayer,
                        speedTests: {
                          ...newPlayer.speedTests!,
                          endurance1km: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPlayerForm(false)
                    setEditingPlayer(null)
                    setNewPlayer({
                      name: '',
                      phone: '',
                      photo: '',
                      position: '',
                      username: '',
                      password: '',
                      physicalMeasures: { height: 0, weight: 0, bodyFat: 0, muscleMass: 0 },
                      speedTests: { ballControl: 0, sprint50m: 0, sprint100m: 0, endurance1km: 0 }
                    })
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingPlayer ? updatePlayer : addPlayer}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPlayer ? 'Atualizar' : 'Salvar'} Jogador</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Form Modal - APENAS ADMIN */}
      {showStaffForm && currentUser === 'admin' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingStaff ? 'Editar' : 'Adicionar'} Membro da Comissão
              </h3>
              <button
                onClick={() => {
                  setShowStaffForm(false)
                  setEditingStaff(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const staff = {
                name: formData.get('name') as string,
                role: formData.get('role') as string,
                photo: formData.get('photo') as string
              }
              
              if (editingStaff) {
                updateStaffMember({ ...editingStaff, ...staff })
              } else {
                addStaffMember(staff)
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingStaff?.name || ''}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input
                  type="text"
                  name="role"
                  defaultValue={editingStaff?.role || ''}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto (PNG ou JPG)
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => {
                      handlePhotoUpload(e, (photoUrl) => {
                        const hiddenInput = document.querySelector('input[name="photo"]') as HTMLInputElement
                        if (hiddenInput) hiddenInput.value = photoUrl
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <input
                    type="hidden"
                    name="photo"
                    defaultValue={editingStaff?.photo || ''}
                  />
                  <p className="text-xs text-gray-500">
                    Selecione uma foto PNG ou JPG do seu computador
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowStaffForm(false)
                    setEditingStaff(null)
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingStaff ? 'Atualizar' : 'Adicionar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Player Details Modal - APENAS ADMIN */}
      {selectedPlayer && currentUser === 'admin' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Detalhes do Jogador</h3>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informações Pessoais</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-3 mb-3">
                      {selectedPlayer.photo ? (
                        <img
                          src={selectedPlayer.photo}
                          alt={selectedPlayer.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="w-8 h-8 text-green-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-lg">{selectedPlayer.name}</p>
                        <p className="text-sm text-gray-600">{selectedPlayer.phone}</p>
                        {selectedPlayer.position && (
                          <p className="text-sm text-green-600 font-medium">{selectedPlayer.position}</p>
                        )}
                      </div>
                    </div>
                    <p><span className="font-medium">Cadastro:</span> {new Date(selectedPlayer.registrationDate).toLocaleDateString('pt-BR')}</p>
                    {selectedPlayer.username && (
                      <p><span className="font-medium">Usuário:</span> {selectedPlayer.username}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Medidas Físicas</h4>
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Altura</p>
                      <p className="font-semibold">{selectedPlayer.physicalMeasures.height} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Peso</p>
                      <p className="font-semibold">{selectedPlayer.physicalMeasures.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gordura Corporal</p>
                      <p className="font-semibold">{selectedPlayer.physicalMeasures.bodyFat}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Massa Muscular</p>
                      <p className="font-semibold">{selectedPlayer.physicalMeasures.muscleMass} kg</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Testes de Performance</h4>
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg ${getPerformanceColor(selectedPlayer.speedTests.ballControl, 'ballControl')}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Domínio de Bola</span>
                        <span className="font-bold">{selectedPlayer.speedTests.ballControl}/10</span>
                      </div>
                      <p className="text-xs mt-1">
                        Nível: {getPerformanceLevel(selectedPlayer.speedTests.ballControl, 'ballControl')}
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg ${getPerformanceColor(selectedPlayer.speedTests.sprint50m, 'sprint50m')}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Corrida 50m</span>
                        <span className="font-bold">{selectedPlayer.speedTests.sprint50m}s</span>
                      </div>
                      <p className="text-xs mt-1">
                        Nível: {getPerformanceLevel(selectedPlayer.speedTests.sprint50m, 'sprint50m')}
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg ${getPerformanceColor(selectedPlayer.speedTests.sprint100m, 'sprint100m')}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Corrida 100m</span>
                        <span className="font-bold">{selectedPlayer.speedTests.sprint100m}s</span>
                      </div>
                      <p className="text-xs mt-1">
                        Nível: {getPerformanceLevel(selectedPlayer.speedTests.sprint100m, 'sprint100m')}
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg ${getPerformanceColor(selectedPlayer.speedTests.endurance1km, 'endurance1km')}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Resistência 1km</span>
                        <span className="font-bold">{selectedPlayer.speedTests.endurance1km} min</span>
                      </div>
                      <p className="text-xs mt-1">
                        Nível: {getPerformanceLevel(selectedPlayer.speedTests.endurance1km, 'endurance1km')}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedPlayer.evolution.length > 1 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Evolução</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Histórico de testes realizados</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedPlayer.evolution.map((record, index) => (
                          <div key={index} className="text-xs bg-white p-2 rounded">
                            <p className="font-medium">{new Date(record.date).toLocaleDateString('pt-BR')}</p>
                            <p>Domínio: {record.ballControl} | 50m: {record.sprint50m}s | 100m: {record.sprint100m}s | 1km: {record.endurance1km}min</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Campo de Futebol com Mapa de Calor GPS no Modal */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Análise Detalhada de Movimentação GPS
              </h4>
              <SoccerFieldHeatMap player={selectedPlayer} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}