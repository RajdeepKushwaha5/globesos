"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Globe, Heart, Shield, Users, Zap, Award } from "lucide-react"
import { motion } from "framer-motion"
import { useGlobalTranslation } from "@/components/translation-provider"

export default function AboutPage() {
  const { t } = useGlobalTranslation()
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-foreground tracking-tight">
              About <span className="gradient-text">GlobeSoS</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Breaking down language barriers in emergency response to save lives across borders
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="p-10 sm:p-14 glass-strong relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              <div className="relative">
                <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  GlobeSoS was founded on a simple yet powerful belief: language should never be a barrier to receiving
                  emergency help. In crisis situations, every second counts, and communication challenges can mean the
                  difference between life and death.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We've built the world's first AI-powered multilingual emergency coordination platform that instantly
                  connects people in crisis with verified responders, regardless of language barriers. Our technology
                  translates emergency communications in real-time across 100+ languages, ensuring that help arrives
                  faster and more effectively.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Heart,
                  title: "Humanity First",
                  description: "Every decision we make prioritizes human safety and dignity above all else.",
                  color: "text-red-500",
                },
                {
                  icon: Zap,
                  title: "Speed Matters",
                  description: "In emergencies, seconds count. We optimize for the fastest possible response times.",
                  color: "text-yellow-500",
                },
                {
                  icon: Globe,
                  title: "Universal Access",
                  description: "Emergency help should be accessible to everyone, regardless of location or language.",
                  color: "text-blue-500",
                },
              ].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 glass-strong hover-lift h-full">
                    <value.icon className={`w-12 h-12 ${value.color} mb-4`} strokeWidth={1.5} />
                    <h3 className="text-xl font-bold mb-3 text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How We Work */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">How We Work</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Verified Network",
                  description:
                    "All responders undergo rigorous verification to ensure you're connected with legitimate NGOs, hospitals, and trained professionals.",
                },
                {
                  icon: Zap,
                  title: "AI Translation",
                  description:
                    "Our advanced AI instantly translates emergency messages with context awareness, ensuring critical details are never lost in translation.",
                },
                {
                  icon: Users,
                  title: "Coordinated Response",
                  description:
                    "Smart matching algorithms connect you with the most appropriate nearby responders based on location, availability, and expertise.",
                },
                {
                  icon: Award,
                  title: "24/7 Availability",
                  description:
                    "Our global network ensures that help is always available, no matter where you are or what time emergency strikes.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 glass-strong hover-lift">
                    <item.icon className="w-10 h-10 text-primary mb-4" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Impact Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="p-10 sm:p-14 glass-strong text-center">
              <h2 className="text-3xl font-bold mb-8 text-foreground">Our Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: "15,000+", label: "Verified Responders" },
                  { value: "180+", label: "Countries" },
                  { value: "100+", label: "Languages" },
                  { value: "<2s", label: "Avg Response Time" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
