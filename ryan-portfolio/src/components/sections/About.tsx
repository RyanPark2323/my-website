import { motion } from 'framer-motion';
import { Mail, MapPin, GraduationCap } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-bg-base">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            About Me
          </h2>
        </motion.div>

        {/* About Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-6 mb-12"
        >
          <p className="text-text-secondary text-lg leading-relaxed">
            I'm a Computer Science student at the University of Utah with a specialization in Artificial Intelligence, 
            graduating Spring 2026. Currently working as an IT Support Intern at the University's Vice President of Research office, 
            where I focus on cybersecurity, systems administration, and infrastructure security.
          </p>
          
          <p className="text-text-secondary text-lg leading-relaxed">
            My passion lies in building intelligent, scalable applications that solve real-world problems. 
            From leading the development of full-stack mobile apps with machine learning integration to 
            designing cloud infrastructure for environmental policy systems, I love tackling complex challenges 
            at the intersection of software engineering and AI.
          </p>

          <p className="text-text-secondary text-lg leading-relaxed">
            Beyond coding, I'm actively involved in cybersecurity competitions (CTF challenges), 
            passionate about educational technology, and always exploring new frameworks and tools to 
            expand my technical toolkit.
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-bg-elevated border border-border rounded-xl p-6 text-center">
            <GraduationCap className="w-8 h-8 text-accent-primary mx-auto mb-3" />
            <h3 className="text-text-primary font-semibold mb-2">Education</h3>
            <p className="text-text-secondary text-sm">BS in Computer Science (AI)</p>
            <p className="text-text-secondary text-sm">University of Utah</p>
          </div>

          <div className="bg-bg-elevated border border-border rounded-xl p-6 text-center">
            <MapPin className="w-8 h-8 text-accent-secondary mx-auto mb-3" />
            <h3 className="text-text-primary font-semibold mb-2">Location</h3>
            <p className="text-text-secondary text-sm">Salt Lake City, Utah</p>
          </div>

          <div className="bg-bg-elevated border border-border rounded-xl p-6 text-center">
            <Mail className="w-8 h-8 text-accent-tertiary mx-auto mb-3" />
            <h3 className="text-text-primary font-semibold mb-2">Contact</h3>
            <a 
              href="mailto:ryan.park2322@gmail.com"
              className="text-accent-primary hover:underline text-sm"
            >
              ryan.park2322@gmail.com
            </a>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <a
            href="mailto:ryan.park2322@gmail.com"
            className="inline-block px-8 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/80 transition-all hover:scale-105 font-medium"
          >
            Let's Connect
          </a>
        </motion.div>
      </div>
    </section>
  );
}
