'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Title,
  Text,
  Button,
  Group,
  Rating,
  Textarea,
  Avatar,
  Badge,
  ActionIcon,
  Divider,
  Progress,
  SimpleGrid,
  Modal,
  Select,
  FileInput,
  Alert,
  Paper,
  Anchor,
  Spoiler,
  Checkbox,
  Pagination,
  Menu,
  Image,
  NumberFormatter
} from '@mantine/core';
import {
  IconStar,
  IconThumbUp,
  IconThumbDown,
  IconFlag,
  IconShare,
  IconCamera,
  IconVideo,
  IconCheck,
  IconX,
  IconDots,
  IconEdit,
  IconTrash,
  IconHeart,
  IconMessage,
  IconShield,
  IconCalendar,
  IconFilter,
  IconSortDescending,
  IconPhoto,
  IconShieldCheck,
  IconReportAnalytics
} from '@tabler/icons-react';

interface ReviewSystemProps {
  locale: string;
  productId: string;
  vendorId?: string;
  allowReviews?: boolean;
  currentUserId?: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  titleAr?: string;
  comment: string;
  commentAr?: string;
  isArabic: boolean;
  date: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  userHelpfulVote?: 'helpful' | 'not_helpful' | null;
  images?: string[];
  videos?: string[];
  pros?: string[];
  prosAr?: string[];
  cons?: string[];
  consAr?: string[];
  wouldRecommend: boolean;
  purchaseDate?: string;
  variant?: string;
  variantAr?: string;
  replies?: ReviewReply[];
  flagged: boolean;
  adminResponse?: {
    message: string;
    messageAr?: string;
    date: string;
    adminName: string;
  };
}

interface ReviewReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  messageAr?: string;
  isArabic: boolean;
  date: string;
  isVendor?: boolean;
  isAdmin?: boolean;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPurchases: number;
  wouldRecommendPercentage: number;
}

export function ReviewSystem({ 
  locale, 
  productId, 
  vendorId, 
  allowReviews = true,
  currentUserId 
}: ReviewSystemProps) {
  const isRTL = locale === 'ar';
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // New review form state
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    pros: [''],
    cons: [''],
    wouldRecommend: true,
    images: [] as File[],
    variant: ''
  });

  // Mock review data with comprehensive Arabic support
  const mockReviews: Review[] = [
    {
      id: '1',
      userId: 'user_001',
      userName: 'Ahmed Al-Mahmood',
      userAvatar: '/api/placeholder/40/40',
      rating: 5,
      title: 'Excellent product quality',
      titleAr: 'جودة منتج ممتازة',
      comment: 'This iPhone exceeds all my expectations. The camera quality is outstanding and the battery life is impressive. Highly recommended for anyone looking for a premium smartphone.',
      commentAr: 'هذا الآيفون فاق كل توقعاتي. جودة الكاميرا رائعة وعمر البطارية مذهل. أنصح به بشدة لأي شخص يبحث عن هاتف ذكي متطور.',
      isArabic: false,
      date: '2025-01-18',
      verified: true,
      helpful: 23,
      notHelpful: 2,
      userHelpfulVote: null,
      images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
      pros: ['Excellent camera', 'Long battery life', 'Fast performance'],
      prosAr: ['كاميرا ممتازة', 'عمر بطارية طويل', 'أداء سريع'],
      cons: ['Expensive', 'No charger included'],
      consAr: ['مكلف', 'لا يتضمن شاحن'],
      wouldRecommend: true,
      purchaseDate: '2025-01-10',
      variant: '256GB - Natural Titanium',
      variantAr: '256 جيجا - تيتانيوم طبيعي',
      flagged: false,
      replies: [
        {
          id: 'reply_1',
          userId: 'vendor_001',
          userName: 'TechStore Support',
          message: 'Thank you for your positive feedback! We\'re glad you\'re enjoying your new iPhone.',
          messageAr: 'شكراً لك على تقييمك الإيجابي! نحن سعداء أنك تستمتع بآيفونك الجديد.',
          isArabic: false,
          date: '2025-01-19',
          isVendor: true
        }
      ]
    },
    {
      id: '2',
      userId: 'user_002',
      userName: 'Fatima Al-Zahra',
      userAvatar: '/api/placeholder/40/40',
      rating: 4,
      title: 'جهاز جيد بشكل عام',
      titleAr: 'جهاز جيد بشكل عام',
      comment: 'الهاتف جيد جداً لكن السعر مرتفع قليلاً. الكاميرا ممتازة والتصميم أنيق. أنصح بالشراء إذا كان لديك الميزانية.',
      commentAr: 'الهاتف جيد جداً لكن السعر مرتفع قليلاً. الكاميرا ممتازة والتصميم أنيق. أنصح بالشراء إذا كان لديك الميزانية.',
      isArabic: true,
      date: '2025-01-15',
      verified: true,
      helpful: 15,
      notHelpful: 3,
      userHelpfulVote: null,
      pros: ['Beautiful design', 'Great camera'],
      prosAr: ['تصميم جميل', 'كاميرا رائعة'],
      cons: ['High price', 'Heavy weight'],
      consAr: ['سعر مرتفع', 'وزن ثقيل'],
      wouldRecommend: true,
      purchaseDate: '2025-01-08',
      variant: '512GB - Blue Titanium',
      variantAr: '512 جيجا - تيتانيوم أزرق',
      flagged: false
    },
    {
      id: '3',
      userId: 'user_003',
      userName: 'Mohammad Al-Rashid',
      userAvatar: '/api/placeholder/40/40',
      rating: 3,
      title: 'Good but has some issues',
      titleAr: 'جيد لكن يحتوي على بعض المشاكل',
      comment: 'The phone is decent but I experienced some heating issues during heavy usage. Customer service was helpful in resolving the problem.',
      commentAr: 'الهاتف لا بأس به لكن واجهت بعض مشاكل الحرارة عند الاستخدام المكثف. خدمة العملاء كانت مفيدة في حل المشكلة.',
      isArabic: false,
      date: '2025-01-12',
      verified: true,
      helpful: 8,
      notHelpful: 12,
      userHelpfulVote: null,
      pros: ['Good performance', 'Nice display'],
      prosAr: ['أداء جيد', 'شاشة جميلة'],
      cons: ['Heating issues', 'Battery drains fast'],
      consAr: ['مشاكل الحرارة', 'البطارية تفرغ بسرعة'],
      wouldRecommend: false,
      purchaseDate: '2025-01-05',
      variant: '128GB - Natural Titanium',
      variantAr: '128 جيجا - تيتانيوم طبيعي',
      flagged: false,
      adminResponse: {
        message: 'Thank you for your feedback. We\'ve forwarded your concerns to our technical team for investigation.',
        messageAr: 'شكراً لك على ملاحظاتك. لقد أحلنا مخاوفك إلى فريقنا التقني للتحقيق.',
        date: '2025-01-13',
        adminName: 'Customer Care Team'
      }
    }
  ];

  // Mock stats
  const mockStats: ReviewStats = {
    averageRating: 4.2,
    totalReviews: 127,
    ratingDistribution: {
      5: 68,
      4: 32,
      3: 15,
      2: 8,
      1: 4
    },
    verifiedPurchases: 95,
    wouldRecommendPercentage: 78
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, [productId]);

  const handleHelpfulVote = (reviewId: string, voteType: 'helpful' | 'not_helpful') => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const currentVote = review.userHelpfulVote;
        let newHelpful = review.helpful;
        let newNotHelpful = review.notHelpful;
        let newVote: 'helpful' | 'not_helpful' | null = voteType;

        // Remove previous vote if exists
        if (currentVote === 'helpful') newHelpful--;
        if (currentVote === 'not_helpful') newNotHelpful--;

        // Add new vote
        if (voteType === 'helpful') {
          if (currentVote === 'helpful') {
            newVote = null; // Remove vote if clicking same option
          } else {
            newHelpful++;
          }
        } else {
          if (currentVote === 'not_helpful') {
            newVote = null; // Remove vote if clicking same option
          } else {
            newNotHelpful++;
          }
        }

        return {
          ...review,
          helpful: newHelpful,
          notHelpful: newNotHelpful,
          userHelpfulVote: newVote
        };
      }
      return review;
    }));
  };

  const submitReview = () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      return;
    }

    const review: Review = {
      id: `review_${Date.now()}`,
      userId: currentUserId || 'current_user',
      userName: 'Current User',
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      isArabic: isRTL,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      helpful: 0,
      notHelpful: 0,
      userHelpfulVote: null,
      pros: newReview.pros.filter(p => p.trim()),
      cons: newReview.cons.filter(c => c.trim()),
      wouldRecommend: newReview.wouldRecommend,
      variant: newReview.variant,
      flagged: false
    };

    setReviews(prev => [review, ...prev]);
    setShowWriteReview(false);
    
    // Reset form
    setNewReview({
      rating: 0,
      title: '',
      comment: '',
      pros: [''],
      cons: [''],
      wouldRecommend: true,
      images: [],
      variant: ''
    });
  };

  const filteredAndSortedReviews = () => {
    let filtered = reviews;

    // Apply filters
    switch (filterBy) {
      case 'verified':
        filtered = filtered.filter(r => r.verified);
        break;
      case 'with_images':
        filtered = filtered.filter(r => r.images && r.images.length > 0);
        break;
      case '5_star':
        filtered = filtered.filter(r => r.rating === 5);
        break;
      case '4_star':
        filtered = filtered.filter(r => r.rating === 4);
        break;
      case '3_star':
        filtered = filtered.filter(r => r.rating === 3);
        break;
      case '2_star':
        filtered = filtered.filter(r => r.rating === 2);
        break;
      case '1_star':
        filtered = filtered.filter(r => r.rating === 1);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest_rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest_rating':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'most_helpful':
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
    }

    return filtered;
  };

  if (loading) {
    return (
      <Card withBorder padding="lg">
        <Group justify="center">
          <Text>{isRTL ? 'جاري تحميل التقييمات...' : 'Loading reviews...'}</Text>
        </Group>
      </Card>
    );
  }

  return (
    <Stack gap="lg">
      
      {/* Review Statistics */}
      {stats && (
        <Card withBorder padding="lg">
          <Group justify="space-between" align="flex-start">
            
            {/* Overall Rating */}
            <div className="text-center">
              <Text size="3rem" fw={700} c="orange">
                {stats.averageRating.toFixed(1)}
              </Text>
              <Rating value={stats.averageRating} readOnly size="lg" />
              <Text size="sm" c="dimmed">
                {stats.totalReviews.toLocaleString()} {isRTL ? 'تقييم' : 'reviews'}
              </Text>
            </div>

            {/* Rating Distribution */}
            <Stack gap="xs" flex={1} mx="xl">
              {[5, 4, 3, 2, 1].map((rating) => (
                <Group key={rating} gap="sm">
                  <Group gap={4}>
                    <Text size="sm">{rating}</Text>
                    <IconStar size={14} className="text-yellow-400" fill="currentColor" />
                  </Group>
                  <Progress 
                    value={(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100}
                    color="orange"
                    flex={1}
                  />
                  <Text size="sm" w={30}>
                    {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                  </Text>
                </Group>
              ))}
            </Stack>

            {/* Additional Stats */}
            <Stack gap="sm">
              <Paper withBorder p="sm" className="text-center">
                <Text fw={600} c="green">
                  {stats.wouldRecommendPercentage}%
                </Text>
                <Text size="xs" c="dimmed">
                  {isRTL ? 'ينصحون بالمنتج' : 'would recommend'}
                </Text>
              </Paper>
              
              <Paper withBorder p="sm" className="text-center">
                <Text fw={600} c="blue">
                  {Math.round((stats.verifiedPurchases / stats.totalReviews) * 100)}%
                </Text>
                <Text size="xs" c="dimmed">
                  {isRTL ? 'مشتريات مؤكدة' : 'verified purchases'}
                </Text>
              </Paper>
            </Stack>

          </Group>
        </Card>
      )}

      {/* Action Buttons */}
      <Group justify="space-between">
        <Group gap="sm">
          <Select
            value={sortBy}
            onChange={setSortBy}
            data={[
              { value: 'newest', label: isRTL ? 'الأحدث' : 'Newest' },
              { value: 'oldest', label: isRTL ? 'الأقدم' : 'Oldest' },
              { value: 'highest_rating', label: isRTL ? 'أعلى تقييم' : 'Highest Rating' },
              { value: 'lowest_rating', label: isRTL ? 'أقل تقييم' : 'Lowest Rating' },
              { value: 'most_helpful', label: isRTL ? 'الأكثر فائدة' : 'Most Helpful' }
            ]}
            leftSection={<IconSortDescending size={16} />}
            w={180}
          />
          
          <Select
            value={filterBy}
            onChange={setFilterBy}
            data={[
              { value: 'all', label: isRTL ? 'جميع التقييمات' : 'All Reviews' },
              { value: 'verified', label: isRTL ? 'مشتريات مؤكدة' : 'Verified Purchases' },
              { value: 'with_images', label: isRTL ? 'مع صور' : 'With Images' },
              { value: '5_star', label: '5 ⭐' },
              { value: '4_star', label: '4 ⭐' },
              { value: '3_star', label: '3 ⭐' },
              { value: '2_star', label: '2 ⭐' },
              { value: '1_star', label: '1 ⭐' }
            ]}
            leftSection={<IconFilter size={16} />}
            w={180}
          />
        </Group>

        {allowReviews && (
          <Button 
            leftSection={<IconStar size={16} />}
            onClick={() => setShowWriteReview(true)}
          >
            {isRTL ? 'اكتب تقييماً' : 'Write a Review'}
          </Button>
        )}
      </Group>

      {/* Reviews List */}
      <Stack gap="lg">
        {filteredAndSortedReviews().slice((currentPage - 1) * 5, currentPage * 5).map((review) => (
          <Card key={review.id} withBorder padding="lg">
            
            {/* Review Header */}
            <Group justify="space-between" mb="md">
              <Group gap="md">
                <Avatar src={review.userAvatar} size="md" />
                <div>
                  <Group gap="sm">
                    <Text fw={500}>{review.userName}</Text>
                    {review.verified && (
                      <Badge color="green" variant="light" size="sm">
                        <IconShieldCheck size={12} />
                        {isRTL ? 'مؤكد' : 'Verified'}
                      </Badge>
                    )}
                  </Group>
                  <Group gap="sm">
                    <Rating value={review.rating} readOnly size="sm" />
                    <Text size="sm" c="dimmed">
                      {review.date}
                    </Text>
                    {review.variant && (
                      <Badge variant="light" size="xs">
                        {isRTL ? review.variantAr : review.variant}
                      </Badge>
                    )}
                  </Group>
                </div>
              </Group>
              
              <Menu>
                <Menu.Target>
                  <ActionIcon variant="subtle">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconFlag size={14} />}>
                    {isRTL ? 'بلاغ عن المحتوى' : 'Report Content'}
                  </Menu.Item>
                  <Menu.Item leftSection={<IconShare size={14} />}>
                    {isRTL ? 'مشاركة' : 'Share'}
                  </Menu.Item>
                  {currentUserId === review.userId && (
                    <>
                      <Menu.Item leftSection={<IconEdit size={14} />}>
                        {isRTL ? 'تعديل' : 'Edit'}
                      </Menu.Item>
                      <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                        {isRTL ? 'حذف' : 'Delete'}
                      </Menu.Item>
                    </>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>

            {/* Review Title */}
            {review.title && (
              <Text fw={600} mb="sm">
                {isRTL && review.titleAr ? review.titleAr : review.title}
              </Text>
            )}

            {/* Review Content */}
            <Spoiler maxHeight={120} showLabel={isRTL ? 'عرض المزيد' : 'Show more'} hideLabel={isRTL ? 'عرض أقل' : 'Show less'}>
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                {isRTL && review.commentAr ? review.commentAr : review.comment}
              </Text>
            </Spoiler>

            {/* Pros and Cons */}
            {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mt="md">
                {review.pros && review.pros.length > 0 && (
                  <div>
                    <Text fw={500} size="sm" c="green" mb="xs">
                      {isRTL ? 'الإيجابيات' : 'Pros'}
                    </Text>
                    <Stack gap="xs">
                      {(isRTL && review.prosAr ? review.prosAr : review.pros).map((pro, index) => (
                        <Group key={index} gap="xs">
                          <IconCheck size={14} className="text-green-500" />
                          <Text size="sm">{pro}</Text>
                        </Group>
                      ))}
                    </Stack>
                  </div>
                )}
                
                {review.cons && review.cons.length > 0 && (
                  <div>
                    <Text fw={500} size="sm" c="red" mb="xs">
                      {isRTL ? 'السلبيات' : 'Cons'}
                    </Text>
                    <Stack gap="xs">
                      {(isRTL && review.consAr ? review.consAr : review.cons).map((con, index) => (
                        <Group key={index} gap="xs">
                          <IconX size={14} className="text-red-500" />
                          <Text size="sm">{con}</Text>
                        </Group>
                      ))}
                    </Stack>
                  </div>
                )}
              </SimpleGrid>
            )}

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <Group gap="sm" mt="md">
                {review.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Review image ${index + 1}`}
                    w={80}
                    h={80}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                ))}
              </Group>
            )}

            {/* Recommendation */}
            {review.wouldRecommend !== undefined && (
              <Alert 
                color={review.wouldRecommend ? 'green' : 'red'} 
                variant="light" 
                mt="md"
                icon={review.wouldRecommend ? <IconThumbUp size={16} /> : <IconThumbDown size={16} />}
              >
                <Text size="sm">
                  {review.wouldRecommend 
                    ? (isRTL ? 'أنصح بهذا المنتج' : 'I would recommend this product')
                    : (isRTL ? 'لا أنصح بهذا المنتج' : 'I would not recommend this product')
                  }
                </Text>
              </Alert>
            )}

            {/* Admin Response */}
            {review.adminResponse && (
              <Paper withBorder p="md" mt="md" bg="blue.0">
                <Group gap="sm" mb="xs">
                  <IconShield size={16} className="text-blue-600" />
                  <Text fw={500} size="sm" c="blue">
                    {review.adminResponse.adminName}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {review.adminResponse.date}
                  </Text>
                </Group>
                <Text size="sm">
                  {isRTL && review.adminResponse.messageAr ? review.adminResponse.messageAr : review.adminResponse.message}
                </Text>
              </Paper>
            )}

            {/* Review Actions */}
            <Divider my="md" />
            <Group justify="space-between">
              <Group gap="md">
                <Button.Group>
                  <Button
                    variant={review.userHelpfulVote === 'helpful' ? 'filled' : 'outline'}
                    size="sm"
                    leftSection={<IconThumbUp size={14} />}
                    onClick={() => handleHelpfulVote(review.id, 'helpful')}
                  >
                    {review.helpful}
                  </Button>
                  <Button
                    variant={review.userHelpfulVote === 'not_helpful' ? 'filled' : 'outline'}
                    size="sm"
                    leftSection={<IconThumbDown size={14} />}
                    onClick={() => handleHelpfulVote(review.id, 'not_helpful')}
                  >
                    {review.notHelpful}
                  </Button>
                </Button.Group>
                
                <Text size="sm" c="dimmed">
                  {isRTL ? 'هل كان هذا التقييم مفيداً؟' : 'Was this review helpful?'}
                </Text>
              </Group>
              
              <Button
                variant="subtle"
                size="sm"
                leftSection={<IconMessage size={14} />}
                onClick={() => {
                  setSelectedReview(review);
                  setShowReplyModal(true);
                }}
              >
                {isRTL ? 'رد' : 'Reply'}
              </Button>
            </Group>

            {/* Replies */}
            {review.replies && review.replies.length > 0 && (
              <Stack gap="sm" mt="md" ml="md" pl="md" style={{ borderLeft: '2px solid #e9ecef' }}>
                {review.replies.map((reply) => (
                  <Paper key={reply.id} withBorder p="sm">
                    <Group gap="sm" mb="xs">
                      <Avatar src={reply.userAvatar} size="sm" />
                      <Text fw={500} size="sm">
                        {reply.userName}
                      </Text>
                      {reply.isVendor && (
                        <Badge color="orange" variant="light" size="xs">
                          {isRTL ? 'البائع' : 'Vendor'}
                        </Badge>
                      )}
                      {reply.isAdmin && (
                        <Badge color="blue" variant="light" size="xs">
                          {isRTL ? 'الإدارة' : 'Admin'}
                        </Badge>
                      )}
                      <Text size="xs" c="dimmed">
                        {reply.date}
                      </Text>
                    </Group>
                    <Text size="sm">
                      {isRTL && reply.messageAr ? reply.messageAr : reply.message}
                    </Text>
                  </Paper>
                ))}
              </Stack>
            )}

          </Card>
        ))}
      </Stack>

      {/* Pagination */}
      {filteredAndSortedReviews().length > 5 && (
        <Group justify="center">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={Math.ceil(filteredAndSortedReviews().length / 5)}
          />
        </Group>
      )}

      {/* Write Review Modal */}
      <Modal
        opened={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        title={isRTL ? 'اكتب تقييماً' : 'Write a Review'}
        size="lg"
        centered
      >
        <Stack gap="md">
          
          {/* Rating */}
          <div>
            <Text fw={500} mb="xs">
              {isRTL ? 'تقييمك الإجمالي' : 'Overall Rating'}
            </Text>
            <Rating
              value={newReview.rating}
              onChange={(value) => setNewReview(prev => ({ ...prev, rating: value }))}
              size="lg"
            />
          </div>

          {/* Title */}
          <Textarea
            label={isRTL ? 'عنوان التقييم' : 'Review Title'}
            placeholder={isRTL ? 'لخص تجربتك في جملة واحدة' : 'Summarize your experience in one sentence'}
            value={newReview.title}
            onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
            rows={1}
          />

          {/* Comment */}
          <Textarea
            label={isRTL ? 'تقييمك التفصيلي' : 'Detailed Review'}
            placeholder={isRTL ? 'شارك تجربتك مع المنتج بالتفصيل...' : 'Share your detailed experience with the product...'}
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
            required
          />

          {/* Pros */}
          <div>
            <Text fw={500} mb="xs">
              {isRTL ? 'الإيجابيات' : 'Pros'}
            </Text>
            {newReview.pros.map((pro, index) => (
              <Group key={index} gap="sm" mb="xs">
                <Textarea
                  placeholder={isRTL ? 'ما أعجبك في المنتج؟' : 'What did you like about the product?'}
                  value={pro}
                  onChange={(e) => {
                    const newPros = [...newReview.pros];
                    newPros[index] = e.target.value;
                    setNewReview(prev => ({ ...prev, pros: newPros }));
                  }}
                  flex={1}
                  rows={1}
                />
                <ActionIcon
                  color="red"
                  variant="outline"
                  onClick={() => {
                    const newPros = newReview.pros.filter((_, i) => i !== index);
                    setNewReview(prev => ({ ...prev, pros: newPros }));
                  }}
                  disabled={newReview.pros.length === 1}
                >
                  <IconX size={14} />
                </ActionIcon>
              </Group>
            ))}
            <Button
              variant="light"
              size="xs"
              onClick={() => setNewReview(prev => ({ ...prev, pros: [...prev.pros, ''] }))}
            >
              {isRTL ? 'إضافة نقطة إيجابية' : 'Add Pro'}
            </Button>
          </div>

          {/* Cons */}
          <div>
            <Text fw={500} mb="xs">
              {isRTL ? 'السلبيات' : 'Cons'}
            </Text>
            {newReview.cons.map((con, index) => (
              <Group key={index} gap="sm" mb="xs">
                <Textarea
                  placeholder={isRTL ? 'ما لم يعجبك في المنتج؟' : 'What did you not like about the product?'}
                  value={con}
                  onChange={(e) => {
                    const newCons = [...newReview.cons];
                    newCons[index] = e.target.value;
                    setNewReview(prev => ({ ...prev, cons: newCons }));
                  }}
                  flex={1}
                  rows={1}
                />
                <ActionIcon
                  color="red"
                  variant="outline"
                  onClick={() => {
                    const newCons = newReview.cons.filter((_, i) => i !== index);
                    setNewReview(prev => ({ ...prev, cons: newCons }));
                  }}
                  disabled={newReview.cons.length === 1}
                >
                  <IconX size={14} />
                </ActionIcon>
              </Group>
            ))}
            <Button
              variant="light"
              size="xs"
              onClick={() => setNewReview(prev => ({ ...prev, cons: [...prev.cons, ''] }))}
            >
              {isRTL ? 'إضافة نقطة سلبية' : 'Add Con'}
            </Button>
          </div>

          {/* Recommendation */}
          <Checkbox
            label={isRTL ? 'أنصح بهذا المنتج' : 'I would recommend this product'}
            checked={newReview.wouldRecommend}
            onChange={(e) => setNewReview(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
          />

          {/* Images */}
          <FileInput
            label={isRTL ? 'إضافة صور (اختياري)' : 'Add Images (Optional)'}
            placeholder={isRTL ? 'اختر الصور' : 'Select images'}
            leftSection={<IconCamera size={16} />}
            multiple
            accept="image/*"
            onChange={(files) => setNewReview(prev => ({ ...prev, images: files || [] }))}
          />

          <Divider />

          <Group justify="flex-end" gap="sm">
            <Button
              variant="outline"
              onClick={() => setShowWriteReview(false)}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              onClick={submitReview}
              disabled={newReview.rating === 0 || !newReview.comment.trim()}
            >
              {isRTL ? 'نشر التقييم' : 'Submit Review'}
            </Button>
          </Group>

        </Stack>
      </Modal>

    </Stack>
  );
}