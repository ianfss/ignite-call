export function getWeekDays() {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from(new Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2025, 9, day))))
    .map((weekDay) => {
      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
    })
}
