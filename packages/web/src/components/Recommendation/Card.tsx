import { Card, CardContent, Typography } from '@mui/material';
import { Component } from '@/models/entities';

interface RecommendationCardProps {
  component: Component;
}

export default function RecommendationCard({
  component,
}: RecommendationCardProps) {
  return (
    <Card sx={{ minWidth: 300, maxWidth: 300 }}>
      <CardContent>
        <Typography variant="caption" color="textSecondary" gutterBottom>
          {component.sigaaId}
        </Typography>

        <Typography variant="body1" component="div">
          {component.title}
        </Typography>
      </CardContent>
    </Card>
  );
}
