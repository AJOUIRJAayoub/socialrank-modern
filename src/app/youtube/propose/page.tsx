'use client';

import React, { useState } from 'react';
import { ArrowLeft, Youtube, Send } from 'lucide-react';
import Link from 'next/link';

export default function ProposePage() {
  const [formData, setFormData] = useState({
    channelUrl: '',
    channelName: '',
    category: 'gaming',
    country: 'FR',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Envoyer à l'API
    alert('Chaîne proposée ! Elle sera vérifiée par notre équipe.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/youtube" className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Retour aux classements
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Youtube className="w-8 h-8 text-red-500" />
            Proposer une chaîne YouTube
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                URL de la chaîne YouTube *
              </label>
              <input
                type="url"
                required
                placeholder="https://youtube.com/@..."
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                value={formData.channelUrl}
                onChange={(e) => setFormData({...formData, channelUrl: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nom de la chaîne *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: PewDiePie"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                value={formData.channelName}
                onChange={(e) => setFormData({...formData, channelName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Catégorie *
                </label>
                <select
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="gaming">Gaming</option>
                  <option value="music">Musique</option>
                  <option value="kids">Enfants</option>
                  <option value="entertainment">Divertissement</option>
                  <option value="education">Éducation</option>
                  <option value="tech">Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Pays *
                </label>
                <select
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                >
                  <option value="FR">France</option>
                  <option value="US">États-Unis</option>
                  <option value="UK">Royaume-Uni</option>
                  <option value="CA">Canada</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Pourquoi proposer cette chaîne ?
              </label>
              <textarea
                rows={4}
                placeholder="Dites-nous pourquoi cette chaîne devrait être dans nos classements..."
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Send className="w-5 h-5" />
              Proposer la chaîne
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}