import mongoose from 'mongoose'
// import { hackathonCurrencyType, hackathonCurrencyTypeEnums, hackathonModeEnums } from './hackathon.constant.js'


const hackathonSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
   problemStatement:{
    type:String,
    required:[true, "Hackathon  problemStatement is required"],
    trim:true,
    maxlength:[2000, "Problem statement cannot exceed 2000 characters"]
  },
  slug:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  mode:{
    type:[String],
    enum:["Solo","Team"],
    required:[true, "Hackathon mode is required"],
  },
  allowedModes:{
    type:[String],

  },
  startDate:{
    type:Date,
    required:true
  },
  endDate:{
    type:Date,
    required:true
  },
  registrationDeadline:{
    type:Date,
    required:true
  },
  submissionDeadline:{
    type:Date,
    required:true
  },
  prizePool:{
    type:Number,
    required:true
  },
  registrationFee:{
    type:Number,
    required:true,
    min: 0
  },
  currency:{
    type:String,
    enum:["INR","DOLLAR"],
    required:true,
    default:"INR"
  },
  minTeamSize:{
    type:Number,
    required:true,
    default:2
  },
  maxTeamSize:{
    type:Number,
    default:4
  },
  technologyDomains:{
    type:[String],
    required:true
  },
  rules:{
    type:[String],
    required:true
  },
  judgingCriteria:{
    type:[
      {
        name:{
          type:String,
          required:true
        },
        weight:{
          type:Number,
          required:true
        }
      }
    ]
  },
  eligibility:{
    type: mongoose.Schema.Types.Mixed,
    required:true,
    default: { studentOnly: true, allowedGraduationYears: [] }
  },
  status: {
    type: String,
    enum: ["draft", "upcoming", "ongoing", "judging", "past"],
    default: "draft",
    required: true
  },
  sponsors:{
    type:[
      {
        name: {
          type: String,
          required: true
        },
        logoUrl: {
          type: String
        }
      }
    ],
    default: []
  },
  resultsPublished: {
    type: Boolean,
    default: false
  },
  publishStatus: {
    type: String,
    enum: ['not_started', 'db_committed', 'side_effects_complete'],
    default: 'not_started'
  },
  isLocked: {
    type: Boolean,
    default: false
  }


},{
  timestamps:true
})

const Hackathon =  mongoose.model("Hackathon", hackathonSchema)

export default Hackathon
