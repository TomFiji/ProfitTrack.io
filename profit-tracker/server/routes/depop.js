import express from 'express'
import supabase from '../config/supabase.js'
import { authenticateUser } from '../middleware/auth.js'
import { parseDepopkCsv } from '../utils/csvParser.js'