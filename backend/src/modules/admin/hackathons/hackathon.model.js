import mongoose from 'mongoose'
// import { hackathonCurrencyType, hackathonCurrencyTypeEnums, hackathonModeEnums } from './hackathon.constant.js'


const hackathonSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
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
    enum:["Solo","Both"]
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
    required:true
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
  }

},{
  timestamps:true
})

const Hackathon =  mongoose.model("Hackathon", hackathonSchema)

export default Hackathon
