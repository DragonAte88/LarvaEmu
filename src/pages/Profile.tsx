import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Bell, Settings as SettingsIcon, CreditCard, LogOut } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-5xl mx-auto pb-20 pt-8 px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-12"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full"></div>
          <span className="text-4xl font-black text-white relative z-10">U</span>
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">User Profile</h1>
          <div className="flex items-center gap-3">
            <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Pro Member</span>
            <span className="text-text-muted font-medium">Joined June 2026</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Account Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <User className="text-primary" />
              Account Details
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <p className="text-text-muted text-sm font-medium mb-1">Email Address</p>
                  <p className="text-white font-medium">user@mediauniverse.app</p>
                </div>
                <button className="text-primary text-sm font-bold hover:text-accent transition-colors">Edit</button>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <p className="text-text-muted text-sm font-medium mb-1">Password</p>
                  <p className="text-white font-medium">••••••••••••</p>
                </div>
                <button className="text-primary text-sm font-bold hover:text-accent transition-colors">Change</button>
              </div>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <SettingsIcon className="text-primary" />
              Preferences
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Bell className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">Push Notifications</p>
                    <p className="text-text-muted text-sm">Get alerts for new episodes and downloads.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(0,255,204,0.3)]">
                  <div className="absolute right-1 top-1 bottom-1 w-4 bg-background rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Shield className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">Content Filters</p>
                    <p className="text-text-muted text-sm">Manage adult content and age restrictions.</p>
                  </div>
                </div>
                <button className="text-primary text-sm font-bold hover:text-accent transition-colors">Manage</button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl border border-primary/30 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/30 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <CreditCard className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">Pro Subscription</h3>
            <p className="text-text-muted text-sm mb-6">Your next billing date is July 12, 2026. $9.99/mo.</p>
            <button className="w-full py-3 bg-white text-background font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg">
              Manage Billing
            </button>
          </div>

          <button className="w-full py-4 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-2xl hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center justify-center gap-2">
            <LogOut size={20} />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
