import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { usePhotoStore } from '../../store/photoStore';
import { mockAnalyzeSkin, mockGetRecommendations } from '../../services/mockApi';
import { AIAnalysisReport } from '../../types';
import { format } from 'date-fns';

export const AIInsightsScreen = () => {
  const navigation = useNavigation();
  const { getRecentPhotos, addPhoto } = usePhotoStore();
  const [latestAnalysis, setLatestAnalysis] = useState<AIAnalysisReport | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalysis = async () => {
    setIsLoading(true);
    try {
      const recentPhotos = getRecentPhotos(1);
      
      if (recentPhotos.length > 0) {
        const latestPhoto = recentPhotos[0];
        const analysis = await mockAnalyzeSkin(latestPhoto.id);
        setLatestAnalysis(analysis);
        
        const recs = await mockGetRecommendations(analysis.id);
        setRecommendations(recs);
      }
    } catch (error) {
      console.error('Failed to load analysis:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalysis();
  };

  const generateRandomReport = async () => {
    setIsLoading(true);
    try {
      // Generate a random photo
      const randomColors = ['FF6B6B', '4169E1', '4CAF50', 'FFC107', '9C27B0'];
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      const randomScore = Math.floor(Math.random() * 20) + 70; // 70-90
      
      const mockPhoto = {
        id: `mock-${Date.now()}`,
        uri: `https://via.placeholder.com/400x400/${randomColor}/FFFFFF?text=Score+${randomScore}`,
        takenAt: new Date(),
        lightQuality: ['poor', 'good', 'excellent'][Math.floor(Math.random() * 3)] as 'poor' | 'good' | 'excellent',
        faceDetected: true,
        paths: {
          original: `https://via.placeholder.com/400x400/${randomColor}/FFFFFF?text=Score+${randomScore}`,
          compressed: `https://via.placeholder.com/400x400/${randomColor}/FFFFFF?text=Score+${randomScore}`,
          thumbnail: `https://via.placeholder.com/400x400/${randomColor}/FFFFFF?text=Score+${randomScore}`,
        },
        metadata: {
          fileSize: 1024 * 1024 * Math.random() * 3,
          dimensions: { width: 400, height: 400 },
          format: 'jpeg' as const,
          compressionRatio: 0.85,
        },
      };
      
      // Add photo to store
      await addPhoto(mockPhoto);
      
      // Generate analysis
      const analysis = await mockAnalyzeSkin(mockPhoto.id);
      setLatestAnalysis(analysis);
      
      const recs = await mockGetRecommendations(analysis.id);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to generate random report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderScoreCard = (label: string, score: number, icon: string, color: string) => {
    return (
      <View style={styles.scoreCard}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.scoreLabel}>{label}</Text>
        <Text style={[styles.scoreValue, { color }]}>{score}</Text>
        <View style={styles.scoreBar}>
          <View style={[styles.scoreBarFill, { width: `${score}%`, backgroundColor: color }]} />
        </View>
      </View>
    );
  };

  const renderInsight = (insight: AIAnalysisReport['insights'][0]) => {
    const severityColors: Record<'info' | 'warning' | 'success', string> = {
      info: '#3498db',
      warning: '#f39c12',
      success: '#27ae60',
    };

    return (
      <View key={insight.category} style={styles.insightCard}>
        <View style={[styles.insightHeader, { borderLeftColor: severityColors[insight.severity] }]}>
          <Text style={styles.insightTitle}>{insight.title}</Text>
          <Icon 
            name={insight.severity === 'success' ? 'check-circle' : 'info'} 
            size={20} 
            color={severityColors[insight.severity]} 
          />
        </View>
        <Text style={styles.insightDescription}>{insight.description}</Text>
        <View style={styles.recommendationList}>
          {insight.recommendations.map((rec: string, index: number) => (
            <View key={index} style={styles.recommendationItem}>
              <Icon name="check" size={16} color="#27ae60" />
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Analyzing your skin...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!latestAnalysis) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
          <View style={styles.emptyState}>
            <Icon name="camera-alt" size={80} color="#ddd" />
            <Text style={styles.emptyTitle}>No photos yet</Text>
            <Text style={styles.emptyText}>Tap the camera button below to start recording</Text>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={generateRandomReport}
            >
              <Icon name="auto-awesome" size={20} color="#fff" />
              <Text style={styles.generateButtonText}>Generate Test Report</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const latestPhoto = getRecentPhotos(1)[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={true}
        bounces={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Latest Photo Section */}
        <View style={styles.photoSection}>
          <Image source={{ uri: latestPhoto.uri }} style={styles.analysisPhoto} />
          <View style={styles.photoInfo}>
            <Text style={styles.photoDate}>
              {format(new Date(latestPhoto.takenAt), 'MMM dd, yyyy HH:mm')}
            </Text>
            <View style={styles.photoQuality}>
              <Icon name="wb-sunny" size={16} color="#4CAF50" />
              <Text style={styles.qualityText}>Light {latestPhoto.lightQuality === 'excellent' ? 'Perfect' : 'Good'}</Text>
            </View>
          </View>
        </View>

        {/* Overall Score */}
        <View style={styles.overallScoreCard}>
          <Text style={styles.overallScoreTitle}>Overall Score</Text>
          <Text style={styles.overallScoreValue}>{latestAnalysis.scores.overall}</Text>
          <View style={styles.scoreComparison}>
            <Icon 
              name={latestAnalysis.comparisonWithLast.overall >= 0 ? 'trending-up' : 'trending-down'} 
              size={20} 
              color={latestAnalysis.comparisonWithLast.overall >= 0 ? '#27ae60' : '#e74c3c'} 
            />
            <Text style={[
              styles.comparisonText,
              { color: latestAnalysis.comparisonWithLast.overall >= 0 ? '#27ae60' : '#e74c3c' }
            ]}>
              Compared to last time {latestAnalysis.comparisonWithLast.overall >= 0 ? '+' : ''}{latestAnalysis.comparisonWithLast.overall} points
            </Text>
          </View>
        </View>

        {/* Detailed Scores */}
        <View style={styles.scoresSection}>
          <Text style={styles.sectionTitle}>Detailed Scores</Text>
          <View style={styles.scoresGrid}>
            {renderScoreCard('Hydration', latestAnalysis.scores.hydration, 'opacity', '#3498db')}
            {renderScoreCard('Elasticity', latestAnalysis.scores.elasticity, 'fitness-center', '#9b59b6')}
            {renderScoreCard('Pores', latestAnalysis.scores.pores, 'blur-circular', '#e67e22')}
            {renderScoreCard('Texture', latestAnalysis.scores.texture, 'texture', '#1abc9c')}
            {renderScoreCard('Radiance', latestAnalysis.scores.radiance, 'wb-sunny', '#f39c12')}
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          {latestAnalysis.insights.map(insight => renderInsight(insight))}
        </View>

        {/* Recommended Products */}
        {recommendations && (
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Recommended Products</Text>
            {recommendations.products.map((product: any, index: number) => (
              <View key={index} style={styles.productCard}>
                <View style={styles.productHeader}>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <Text style={styles.productName}>{product.name}</Text>
                </View>
                <Text style={styles.productDescription}>{product.description}</Text>
                <View style={styles.ingredientsList}>
                  {product.keyIngredients.map((ingredient: string, i: number) => (
                    <View key={i} style={styles.ingredientChip}>
                      <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.productUsage}>{product.usage}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.compareButton}
            onPress={() => navigation.navigate('Compare' as never)}
          >
            <Icon name="compare" size={20} color="#FF6B6B" />
            <Text style={styles.compareButtonText}>View History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Icon name="share" size={20} color="#fff" />
            <Text style={styles.shareButtonText}>Share Report</Text>
          </TouchableOpacity>
        </View>
        
        {/* Generate Random Report Button */}
        <View style={styles.generateButtonContainer}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateRandomReport}
          >
            <Icon name="auto-awesome" size={20} color="#fff" />
            <Text style={styles.generateButtonText}>Generate New Test Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  photoSection: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  analysisPhoto: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  photoInfo: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  photoQuality: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qualityText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#4CAF50',
  },
  overallScoreCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overallScoreTitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  overallScoreValue: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  scoreComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  comparisonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  scoresSection: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scoreCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  scoreBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#ecf0f1',
    borderRadius: 2,
    marginTop: 5,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  insightsSection: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 15,
  },
  insightCard: {
    marginBottom: 15,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  insightDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
    paddingLeft: 13,
  },
  recommendationList: {
    paddingLeft: 13,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 14,
    color: '#34495e',
    marginLeft: 8,
  },
  productsSection: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 15,
  },
  productCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  productHeader: {
    marginBottom: 10,
  },
  productCategory: {
    fontSize: 12,
    color: '#FF6B6B',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  productDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  ingredientChip: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  ingredientText: {
    fontSize: 12,
    color: '#3498db',
  },
  productUsage: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    marginBottom: 30,
  },
  compareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  compareButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    marginLeft: 5,
  },
  shareButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9b59b6',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  generateButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  generateButtonContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 30,
  },
});