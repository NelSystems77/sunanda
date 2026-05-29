import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { cn, formatDate, calculateAge, formatPhoneNumber } from '@/shared/utils';
import { Client } from '@/core/domain/interfaces/Client';

export interface ClientCardProps {
  client: Client;
  onClick?: (client: Client) => void;
  className?: string;
}

const genderLabels = {
  MALE: 'Masculino',
  FEMALE: 'Femenino',
  OTHER: 'Otro',
};

export function ClientCard({ client, onClick, className }: ClientCardProps) {
  const age = calculateAge(client.dateOfBirth);
  const fullName = `${client.firstName} ${client.lastName}`;

  return (
    <motion.div
      whileHover={{ y: onClick ? -4 : 0 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      className={cn(className)}
    >
      <Card
        padding="md"
        hover={!!onClick}
        onClick={onClick ? () => onClick(client) : undefined}
        className={cn(onClick && 'cursor-pointer')}
      >
        <CardContent className="p-0">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar
              src={client.photoURL}
              name={fullName}
              size="lg"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-dark-900 dark:text-white text-lg">
                    {fullName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" size="sm">
                      {age} años
                    </Badge>
                    <Badge variant="default" size="sm">
                      {genderLabels[client.gender]}
                    </Badge>
                  </div>
                </div>

                {client.totalVisits > 0 && (
                  <Badge variant="primary" size="sm">
                    {client.totalVisits} {client.totalVisits === 1 ? 'visita' : 'visitas'}
                  </Badge>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{formatPhoneNumber(client.phoneNumber)}</span>
                </div>

                {client.city && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{client.city}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Cliente desde {formatDate(client.createdAt)}
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              {(client.skinType || (client.allergies?.length ?? 0) > 0) && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-700">
                  {client.skinType && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>Tipo de piel:</strong> {client.skinType}
                    </p>
                  )}
                  {client.allergies && client.allergies.length > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <strong>Alergias:</strong> {client.allergies.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
