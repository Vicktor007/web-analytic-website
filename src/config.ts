export const FREE_QUOTA = {
    maxEventsPerMonth: 100,
    maxEventCategories: 3,
    maxWebsites: 3
} as const

export const PRO_QUOTA = {
    maxEventsPerMonth: 1000,
    maxEventCategories: 10,
    maxWebsites: 20
} as const