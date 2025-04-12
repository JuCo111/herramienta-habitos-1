/**
 * Verifica si se ha alcanzado el 85% para desbloquear una recompensa
 */
function checkRewardUnlock() {
  // Calcular el porcentaje de progreso semanal
  const progress = calculateWeeklyProgress();
  
  // Si se alcanzó al menos el 85% y hay recompensas disponibles
  if (progress >= 85) {
    const availableRewards = appState.rewards.filter(r => !r.claimed);
    
    if (availableRewards.length > 0) {
      // Mostrar modal de recompensa desbloqueada
      showRewardUnlockModal();
    }
  }
}

/**
 * Calcula el progreso semanal actual
 * @returns {number} Porcentaje de hábitos completados en la semana
 */
function calculateWeeklyProgress() {
  // Actualizar contadores semanales
  updateWeeklyProgress();
  
  // Calcular porcentaje
  const percentage = appState.weekHabitsTotal === 0 ? 0 :
    Math.round((appState.weekHabitsCompleted / appState.weekHabitsTotal) * 100);
  
  return percentage;
}

/**
 * Actualiza el conteo de hábitos semanales para estadísticas
 */
function updateWeeklyProgress() {
  // Obtener fecha de inicio de la semana actual (lunes)
  const today = new Date();
  const dayOfWeek = today.getDay() || 7; // 0 es domingo, convertir a 7
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() - dayOfWeek + 1);
  const monday = mondayDate.toISOString().split('T')[0];
  
  // Total de hábitos posibles esta semana
  const daysElapsed = (dayOfWeek === 0 ? 7 : dayOfWeek); // 1 = lunes, 7 = domingo
  appState.weekHabitsTotal = appState.habits.length * daysElapsed;
  
  // Total de hábitos completados esta semana
  appState.weekHabitsCompleted = 0;
  appState.habits.forEach(habit => {
    const completedThisWeek = habit.completedDates.filter(date => {
      return date >= monday;
    }).length;
    
    appState.weekHabitsCompleted += completedThisWeek;
  });
  
  // Guardar el progreso en el estado
  appState.currentWeekProgress = calculateWeeklyProgress();
  saveAppData();
}

/**
 * Muestra el modal para elegir una recompensa desbloqueada
 */
function showRewardUnlockModal() {
  // Implementar cuando tengamos el HTML
  // Mostrar un modal con las recompensas disponibles y animación festiva
}

// =======================================
// DIARIO DE GRATITUD
// =======================================

/**
 * Abre el diario de gratitud con la pregunta del día
 */
function openGratitudeDiary() {
  // Determinar qué pregunta mostrar según el día de la semana
  const dayOfWeek = new Date().getDay(); // 0 = domingo, 6 = sábado
  const questionIndex = dayOfWeek;
  
  // Obtener la pregunta en el idioma actual
  const question = diaryQuestions[appState.language][questionIndex];
  
  // Implementar cuando tengamos el HTML
  // Mostrar el diario con la pregunta correspondiente
  
  // Cambiar a la vista del diario
  showView('diary');
  
  // Iniciar temporizador de 10 minutos
  startDiaryTimer();
}

/**
 * Inicia el temporizador para el diario de gratitud (10 minutos)
 */
function startDiaryTimer() {
  // Duración: 10 minutos en milisegundos
  const duration = 10 * 60 * 1000;
  
  // Implementar cuando tengamos el HTML
  // Mostrar temporizador en la interfaz
  
  // Programar cierre automático tras 10 minutos
  setTimeout(closeDiary, duration);
}

/**
 * Cierra el diario de gratitud y muestra mensaje de cierre
 */
function closeDiary() {
  // Mostrar mensaje de finalización
  const messages = endOfDayPhrases[appState.language];
  const randomIndex = Math.floor(Math.random() * messages.length);
  const message = messages[randomIndex];
  
  // Implementar cuando tengamos el HTML
  // Mostrar mensaje final
  
  // Volver a la vista de hábitos
  setTimeout(() => {
    showView('habits');
  }, 3000); // Esperar 3 segundos antes de cambiar
}

/**
 * Función para finalizar el día, muestra resumen y diario de gratitud
 */
function endDay() {
  // Mostrar resumen del día (hábitos completados, etc)
  showDailySummary();
  
  // Abrir diario de gratitud
  openGratitudeDiary();
}

/**
 * Muestra un resumen de los hábitos del día
 */
function showDailySummary() {
  // Contar hábitos completados hoy
  const today = new Date().toISOString().split('T')[0];
  const completedToday = appState.habits.filter(h => 
    h.completedDates.includes(today)
  ).length;
  
  const percentage = Math.round((completedToday / appState.habits.length) * 100);
  
  // Implementar cuando tengamos el HTML
  // Mostrar resumen en la interfaz
}

// =======================================
// ESTADÍSTICAS Y SEGUIMIENTO
// =======================================

/**
 * Renderiza las estadísticas en la interfaz
 */
function renderStatistics() {
  // Implementar cuando tengamos el HTML
  // El código para renderizar estadísticas en el DOM irá aquí
  
  // Actualizar progreso semanal
  updateWeeklyProgress();
}

/**
 * Actualiza todas las estadísticas
 */
function updateStatistics() {
  // Actualizar estadísticas diarias
  updateDailyStats();
  
  // Actualizar estadísticas semanales
  updateWeeklyProgress();
  
  // Actualizar estadísticas mensuales
  updateMonthlyStats();
  
  // Renderizar los resultados
  renderStatistics();
}

/**
 * Actualiza las estadísticas diarias
 */
function updateDailyStats() {
  const today = new Date().toISOString().split('T')[0];
  
  // Estadísticas para cada hábito
  appState.habits.forEach(habit => {
    if (!appState.statistics.daily[habit.id]) {
      appState.statistics.daily[habit.id] = {};
    }
    
    // Si se completó hoy, guardar el valor real
    if (habit.completedDates.includes(today)) {
      appState.statistics.daily[habit.id][today] = habit.actual;
    }
  });
  
  saveAppData();
}

/**
 * Actualiza las estadísticas mensuales
 */
function updateMonthlyStats() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
  
  // Inicializar estadísticas del mes si no existen
  if (!appState.statistics.monthly[monthKey]) {
    appState.statistics.monthly[monthKey] = {};
    
    appState.habits.forEach(habit => {
      appState.statistics.monthly[monthKey][habit.id] = {
        total: 0,
        days: 0,
        average: 0
      };
    });
  }
  
  // Calcular estadísticas para cada hábito
  appState.habits.forEach(habit => {
    const habitStats = appState.statistics.monthly[monthKey][habit.id];
    
    // Contar días en que se completó este mes
    const daysCompletedThisMonth = habit.completedDates.filter(date => {
      return date.startsWith(`${year}-${month.toString().padStart(2, '0')}`);
    }).length;
    
    // Calcular total y promedio
    let totalValue = 0;
    habit.completedDates.forEach(date => {
      if (date.startsWith(`${year}-${month.toString().padStart(2, '0')}`) && 
          appState.statistics.daily[habit.id] && 
          appState.statistics.daily[habit.id][date]) {
        totalValue += appState.statistics.daily[habit.id][date];
      }
    });
    
    // Actualizar estadísticas
    habitStats.total = totalValue;
    habitStats.days = daysCompletedThisMonth;
    habitStats.average = daysCompletedThisMonth > 0 ? 
      Math.round(totalValue / daysCompletedThisMonth) : 0;
  });
  
  saveAppData();
}

/**
 * Exporta un resumen semanal en formato PDF
 */
function exportWeeklyPDF() {
  // Aquí implementaremos la generación del PDF
  // Se puede usar la biblioteca jsPDF o similar
  
  // Ejemplo de implementación básica (a completar):
  /*
  const doc = new jsPDF();
  
  // Título y fecha
  doc.setFontSize(22);
  doc.text('Resumen Semanal de Hábitos', 20, 20);
  
  // Frase inicial motivacional
  doc.setFontSize(12);
  doc.text(pdfTexts[appState.language].start, 20, 30);
  
  // Contenido del resumen
  // ... códigko para añadir los hábitos, estadísticas, etc.
  
  // Frase final
  doc.text(pdfTexts[appState.language].end, 20, 270);
  
  // Guardar PDF
  doc.save('habitos-resumen-semanal.pdf');
  */
}

/**
 * Exporta un resumen mensual en formato PDF
 */
function exportMonthlyPDF() {
  // Similar a exportWeeklyPDF pero con datos mensuales
}

// =======================================
// NOTIFICACIONES Y TEMPORIZADORES
// =======================================

/**
 * Verifica si hay notificaciones pendientes (por hora)
 */
function checkNotifications() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Formato de hora actual (HH:MM)
  const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
  
  // Verificar hábitos programados para esta hora
  appState.habits.forEach(habit => {
    // Comparar solo hora y minuto
    const habitHour = parseInt(habit.time.split(':')[0]);
    const habitMinute = parseInt(habit.time.split(':')[1]);
    
    // Si coincide la hora y el minuto está entre 0-4 (primeros 5 minutos de la hora)
    if (habitHour === currentHour && currentMinute >= habitMinute && currentMinute < habitMinute + 5) {
      if (!habit.completed) {
        showHabitNotification(habit);
      }
    }
  });
  
  // Verificar si es hora del diario de gratitud
  const diaryHour = parseInt(appState.diaryTime.split(':')[0]);
  const diaryMinute = parseInt(appState.diaryTime.split(':')[1]);
  
  if (diaryHour === currentHour && currentMinute >= diaryMinute && currentMinute < diaryMinute + 5) {
    // Mostrar notificación para el diario
    showDiaryNotification();
  }
}

/**
 * Muestra una notificación para un hábito programado
 * @param {Object} habit - El hábito para el que mostrar notificación
 */
function showHabitNotification(habit) {
  // Implementar cuando tengamos el HTML
  // Mostrar notificación en la interfaz
  
  // Ejemplo de mensaje
  const message = `🌿 Es tu momento para: ${habit.name[appState.language]}`;
  
  console.log(message); // Placeholder hasta implementar la interfaz
}

/**
 * Muestra una notificación para el diario de gratitud
 */
function showDiaryNotification() {
  // Implementar cuando tengamos el HTML
  // Mostrar notificación en la interfaz
  
  const message = translations[appState.language].diaryPrompt;
  
  console.log(message); // Placeholder hasta implementar la interfaz
}

/**
 * Inicia un temporizador para un hábito específico
 * @param {string} habitId - ID del hábito para el que iniciar temporizador
 */
function startHabitTimer(habitId) {
  const habit = appState.habits.find(h => h.id === habitId);
  
  if (!habit) return;
  
  // Implementar cuando tengamos el HTML
  // Mostrar temporizador en la interfaz
  
  // Duración en minutos convertida a milisegundos
  const duration = habit.target * 60 * 1000;
  
  // Temporizar para mostrar notificación al completar
  setTimeout(() => {
    // Preguntar cuánto tiempo real completó
    askActualTimeCompleted(habitId);
  }, duration);
}

/**
 * Pregunta al usuario cuánto tiempo real completó para un hábito
 * @param {string} habitId - ID del hábito
 */
function askActualTimeCompleted(habitId) {
  // Implementar cuando tengamos el HTML
  // Mostrar modal para preguntar tiempo real
  
  // Ejemplo de implementación:
  /*
  const habit = appState.habits.find(h => h.id === habitId);
  
  // Crear modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${translations[appState.language].minutesToday}</h3>
      <input type="number" id="actual-time" value="${habit.target}" min="0">
      <button id="save-time">${translations[appState.language].saveChanges}</button>
    </div>
  `;
  
  // Añadir al DOM
  document.body.appendChild(modal);
  
  // Event listener para guardar
  document.getElementById('save-time').addEventListener('click', function() {
    const actualTime = parseInt(document.getElementById('actual-time').value) || 0;
    completeHabit(habitId, actualTime);
    modal.remove();
  });
  */
}

// =======================================
// CONFIGURACIÓN Y AJUSTES
// =======================================

/**
 * Renderiza la pantalla de configuración
 */
function renderSettings() {
  // Implementar cuando tengamos el HTML
  // El código para renderizar la pantalla de configuración irá aquí
}

/**
 * Guarda los cambios en la configuración
 * @param {Object} settings - Nuevos ajustes a guardar
 */
function saveSettings(settings) {
  // Actualizar hora del diario
  if (settings.diaryTime) {
    appState.diaryTime = settings.diaryTime;
  }
  
  // Actualizar idioma si cambia
  if (settings.language && settings.language !== appState.language) {
    setLanguage(settings.language);
  }
  
  // Guardar cambios
  saveAppData();
  
  // Actualizar interfaz
  renderSettings();
}

/**
 * Muestra un diálogo de confirmación para reiniciar todos los datos
 */
function confirmReset() {
  // Implementar cuando tengamos el HTML
  // Mostrar diálogo de confirmación
  
  // Ejemplo de implementación:
  /*
  if (confirm(translations[appState.language].confirmReset)) {
    resetAllData();
  }
  */
}

/**
 * Reinicia todos los datos a valores predeterminados
 */
function resetAllData() {
  // Guardar solo el idioma actual
  const currentLanguage = appState.language;
  
  // Reiniciar estado
  appState = {
    language: currentLanguage,
    habits: defaultHabits,
    rewards: defaultRewards,
    specialRewards: defaultSpecialRewards,
    completedRewards: [],
    completedSpecialRewards: [],
    statistics: {
      daily: {},
      weekly: {},
      monthly: {}
    },
    diaryTime: '21:00',
    lastReset: null,
    currentWeekProgress: 0,
    weekHabitsTotal: 0,
    weekHabitsCompleted: 0
  };
  
  // Guardar cambios
  saveAppData();
  
  // Reiniciar interfaz
  setupUI();
}

// =======================================
// UTILIDADES Y FUNCIONES AUXILIARES
// =======================================

/**
 * Obtiene una traducción específica basada en una clave
 * @param {string} key - Clave de traducción
 * @returns {string} Texto traducido
 */
function i18n(key) {
  return translations[appState.language][key] || key;
}

/**
 * Formatea una fecha en formato legible según el idioma
 * @param {string} dateString - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {string} Fecha formateada
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString(appState.language === 'es' ? 'es-ES' : 'en-US', options);
}

/**
 * Genera un ID único para elementos
 * @param {string} prefix - Prefijo para el ID
 * @returns {string} ID único
 */
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Muestra un mensaje temporal en la interfaz
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje ('success', 'error', 'info')
 * @param {number} duration - Duración en ms
 */
function showToast(message, type = 'info', duration = 3000) {
  // Implementar cuando tengamos el HTML/CSS
  // Mostrar mensaje temporal
  
  // Ejemplo de implementación:
  /*
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Animar entrada
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Eliminar después de la duración
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300); // Tiempo para la animación de salida
  }, duration);
  */
}

// =======================================
// REGISTRO Y DEPURACIÓN
// =======================================

/**
 * Registra eventos importantes para depuración
 * @param {string} action - Acción realizada
 * @param {Object} data - Datos relacionados
 */
function logEvent(action, data = {}) {
  if (window.DEBUG_MODE) { 
    console.log(`[${new Date().toISOString()}] ${action}`, data);
  }
}

// Exponer la variable DEBUG_MODE (puede activarse desde consola)
window.DEBUG_MODE = false;

// Exponer funciones útiles para depuración
if (typeof window !== 'undefined') {
  window.appDebug = {
    getState: () => ({...appState}),
    resetData: resetAllData,
    toggleDebug: () => {
      window.DEBUG_MODE = !window.DEBUG_MODE;
      return `Modo depuración: ${window.DEBUG_MODE ? 'ACTIVADO' : 'DESACTIVADO'}`;
    }
  };
}