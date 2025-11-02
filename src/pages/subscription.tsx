import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/config/axios';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';
import styles from './subscription.module.scss';

export const Route = createFileRoute('/subscription')({
  component: SubscriptionPage,
});

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      'Up to 10 products',
      'Basic analytics',
      'Community support',
    ],
    value: 'free',
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    features: [
      'Unlimited products',
      'Advanced analytics',
      'Priority support',
      '5 active promotions',
    ],
    value: 'premium',
    popular: true,
  },
  {
    name: 'Business',
    price: '$29.99',
    period: '/month',
    features: [
      'Everything in Premium',
      'Unlimited promotions',
      'Custom branding',
      'API access',
      'Dedicated account manager',
    ],
    value: 'business',
  },
];

function SubscriptionPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (plan: string) => {
      const response = await api.put('/users/subscription', {
        subscription_plan: plan,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast('Subscription updated successfully', undefined, 'success');
    },
    onError: () => {
      toast('Failed to update subscription', undefined, 'error');
    },
  });

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.title}>Choose Your Plan</h1>
        <p className={styles.subtitle}>
          Upgrade to unlock more features and grow your business
        </p>
      </motion.div>

      <div className={styles.plansGrid}>
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {plan.popular && <div className={styles.badge}>Most Popular</div>}

            <h3 className={styles.planName}>{plan.name}</h3>
            <div className={styles.planPrice}>
              {plan.price}
              {plan.period && <span className={styles.period}>{plan.period}</span>}
            </div>

            <ul className={styles.features}>
              {plan.features.map((feature) => (
                <li key={feature} className={styles.feature}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? 'primary' : 'outline'}
              size="lg"
              className={styles.subscribeButton}
              onClick={() => subscribeMutation.mutate(plan.value)}
              isLoading={subscribeMutation.isPending}
            >
              Choose {plan.name}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
