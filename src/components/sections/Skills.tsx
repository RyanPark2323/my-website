import { motion } from 'framer-motion';
import { skillsData } from '../../data/skills';

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-6 bg-bg-elevated">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Technical Skills
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            A comprehensive toolkit built through hands-on projects, coursework, and real-world experience
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillsData.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
              className="bg-bg-base border border-border rounded-xl p-6 hover:border-accent-primary/50 transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <h3 className="text-xl font-bold text-text-primary">
                  {category.category}
                </h3>
              </div>

              {/* Skills List */}
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    className="flex items-center justify-between group"
                  >
                    <span className="text-text-secondary group-hover:text-accent-primary transition-colors">
                      {skill.name}
                    </span>
                    {skill.proficiency && (
                      <span className="text-xs px-2 py-1 rounded-full bg-accent-primary/10 text-accent-primary">
                        {skill.proficiency}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
