"use client"
import CreateToken from '@/components/CreateToken'
import React from 'react'

function page() {
  return (
    // <div>
      <CreateToken />
    // </div>
  )
}

export default page

// import type React from "react"

// import { useState } from "react"
// import { Upload, X, Send, Globe, Wallet, Zap, TrendingUp, Users } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Alert, AlertDescription } from "@/components/ui/alert"

// export default function CreateTokenPage() {
//   const [tokenData, setTokenData] = useState({
//     name: "",
//     symbol: "",
//     description: "",
//     twitter: "",
//     telegram: "",
//     website: "",
//     image: null as File | null,
//   })

//   const [imagePreview, setImagePreview] = useState<string | null>(null)
//   const [isConnected, setIsConnected] = useState(false)

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setTokenData({ ...tokenData, image: file })
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setImagePreview(e.target?.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleInputChange = (field: string, value: string) => {
//     setTokenData({ ...tokenData, [field]: value })
//   }

//   const isFormValid = tokenData.name && tokenData.symbol && tokenData.description && tokenData.image

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
//       {/* Header */}
//       <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
//                 <Zap className="w-5 h-5 text-white" />
//               </div>
//               <span className="text-xl font-bold text-white">pump.fun</span>
//             </div>
//             <Button
//               onClick={() => setIsConnected(!isConnected)}
//               className={`${isConnected ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"} text-white`}
//             >
//               <Wallet className="w-4 h-4 mr-2" />
//               {isConnected ? "Connected" : "Connect Wallet"}
//             </Button>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-6xl mx-auto">
//           {/* Title Section */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Create Your Token</h1>
//             <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//               Launch your meme coin in seconds. No coding required, just pure fun and potential gains.
//             </p>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//             <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
//               <CardContent className="p-4 text-center">
//                 <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-white">$2.4M</div>
//                 <div className="text-sm text-gray-400">24h Volume</div>
//               </CardContent>
//             </Card>
//             <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
//               <CardContent className="p-4 text-center">
//                 <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-white">12,847</div>
//                 <div className="text-sm text-gray-400">Tokens Created</div>
//               </CardContent>
//             </Card>
//             <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
//               <CardContent className="p-4 text-center">
//                 <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-white">0.02 SOL</div>
//                 <div className="text-sm text-gray-400">Creation Fee</div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Create Token Form */}
//             <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="text-2xl text-white">Token Details</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Image Upload */}
//                 <div className="space-y-2">
//                   <Label className="text-white">Token Image</Label>
//                   <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
//                     {imagePreview ? (
//                       <div className="space-y-4">
//                         <img
//                           src={imagePreview || "/placeholder.svg"}
//                           alt="Token preview"
//                           className="w-24 h-24 rounded-full mx-auto object-cover"
//                         />
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => document.getElementById("image-upload")?.click()}
//                           className="border-white/20 text-white hover:bg-white/10"
//                         >
//                           Change Image
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         <Upload className="w-12 h-12 text-gray-400 mx-auto" />
//                         <div>
//                           <Button
//                             variant="outline"
//                             onClick={() => document.getElementById("image-upload")?.click()}
//                             className="border-white/20 text-white hover:bg-white/10"
//                           >
//                             Upload Image
//                           </Button>
//                           <p className="text-sm text-gray-400 mt-2">PNG, JPG up to 5MB</p>
//                         </div>
//                       </div>
//                     )}
//                     <input
//                       id="image-upload"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                     />
//                   </div>
//                 </div>

//                 {/* Token Name */}
//                 <div className="space-y-2">
//                   <Label htmlFor="name" className="text-white">
//                     Token Name
//                   </Label>
//                   <Input
//                     id="name"
//                     placeholder="e.g., Doge Coin"
//                     value={tokenData.name}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
//                   />
//                 </div>

//                 {/* Token Symbol */}
//                 <div className="space-y-2">
//                   <Label htmlFor="symbol" className="text-white">
//                     Token Symbol
//                   </Label>
//                   <Input
//                     id="symbol"
//                     placeholder="e.g., DOGE"
//                     value={tokenData.symbol}
//                     onChange={(e) => handleInputChange("symbol", e.target.value.toUpperCase())}
//                     className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
//                     maxLength={10}
//                   />
//                 </div>

//                 {/* Description */}
//                 <div className="space-y-2">
//                   <Label htmlFor="description" className="text-white">
//                     Description
//                   </Label>
//                   <Textarea
//                     id="description"
//                     placeholder="Tell the world about your token..."
//                     value={tokenData.description}
//                     onChange={(e) => handleInputChange("description", e.target.value)}
//                     className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
//                     maxLength={500}
//                   />
//                   <div className="text-right text-sm text-gray-400">{tokenData.description.length}/500</div>
//                 </div>

//                 {/* Social Links */}
//                 <div className="space-y-4">
//                   <Label className="text-white">Social Links (Optional)</Label>

//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <X className="w-4 h-4 text-blue-400" />
//                       <Input
//                         placeholder="Twitter username"
//                         value={tokenData.twitter}
//                         onChange={(e) => handleInputChange("twitter", e.target.value)}
//                         className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <Send className="w-4 h-4 text-blue-500" />
//                       <Input
//                         placeholder="Telegram username"
//                         value={tokenData.telegram}
//                         onChange={(e) => handleInputChange("telegram", e.target.value)}
//                         className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <Globe className="w-4 h-4 text-green-400" />
//                       <Input
//                         placeholder="Website URL"
//                         value={tokenData.website}
//                         onChange={(e) => handleInputChange("website", e.target.value)}
//                         className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Preview & Launch */}
//             <div className="space-y-6">
//               {/* Token Preview */}
//               <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
//                 <CardHeader>
//                   <CardTitle className="text-2xl text-white">Token Preview</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
//                     <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
//                       {imagePreview ? (
//                         <img
//                           src={imagePreview || "/placeholder.svg"}
//                           alt="Token"
//                           className="w-full h-full rounded-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-white font-bold text-xl">
//                           {tokenData.symbol ? tokenData.symbol[0] : "?"}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-xl font-bold text-white">{tokenData.name || "Token Name"}</h3>
//                       <div className="flex items-center gap-2">
//                         <Badge variant="secondary" className="bg-white/10 text-white">
//                           ${tokenData.symbol || "SYMBOL"}
//                         </Badge>
//                         <span className="text-sm text-gray-400">• Just launched</span>
//                       </div>
//                     </div>
//                   </div>

//                   {tokenData.description && (
//                     <div className="p-4 bg-white/5 rounded-lg">
//                       <p className="text-gray-300 text-sm leading-relaxed">{tokenData.description}</p>
//                     </div>
//                   )}

//                   {/* Social Links Preview */}
//                   {(tokenData.twitter || tokenData.telegram || tokenData.website) && (
//                     <div className="flex gap-2">
//                       {tokenData.twitter && (
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="border-white/20 text-white hover:bg-white/10 bg-transparent"
//                         >
//                           <X className="w-4 h-4" />
//                         </Button>
//                       )}
//                       {tokenData.telegram && (
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="border-white/20 text-white hover:bg-white/10 bg-transparent"
//                         >
//                           <Send className="w-4 h-4" />
//                         </Button>
//                       )}
//                       {tokenData.website && (
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="border-white/20 text-white hover:bg-white/10 bg-transparent"
//                         >
//                           <Globe className="w-4 h-4" />
//                         </Button>
//                       )}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Launch Details */}
//               <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
//                 <CardHeader>
//                   <CardTitle className="text-xl text-white">Launch Details</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-3">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-400">Initial Supply</span>
//                       <span className="text-white">1,000,000,000</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-400">Creation Fee</span>
//                       <span className="text-white">0.02 SOL</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-400">Initial Liquidity</span>
//                       <span className="text-white">Auto-generated</span>
//                     </div>
//                     <Separator className="bg-white/10" />
//                     <div className="flex justify-between font-semibold">
//                       <span className="text-white">Total Cost</span>
//                       <span className="text-white">0.02 SOL</span>
//                     </div>
//                   </div>

//                   {!isConnected && (
//                     <Alert className="bg-yellow-500/10 border-yellow-500/20">
//                       <AlertDescription className="text-yellow-200">
//                         Connect your wallet to create a token
//                       </AlertDescription>
//                     </Alert>
//                   )}

//                   <Button
//                     className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 text-lg"
//                     disabled={!isConnected || !isFormValid}
//                   >
//                     {!isConnected ? "Connect Wallet First" : "Create Token"}
//                   </Button>

//                   <p className="text-xs text-gray-400 text-center">
//                     By creating a token, you agree to our terms of service
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
