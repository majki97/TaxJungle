from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView, \
    GenericAPIView, RetrieveAPIView
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from apps.article.models import Article
from apps.article.serializers.serializer import ArticleSerializer


class ArticleCreateView(CreateAPIView):
    """
    Create article by admin only
    """
    serializer_class = ArticleSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ListArticleView(ListAPIView):
    """
    List of all the articles in chronological order
    """
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Article.objects.all().order_by("-created")


class UpdateDeleteArticleView(RetrieveUpdateDestroyAPIView):
    """
    Update and Delete Article by admin only
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_url_kwarg = 'article_id'
    permission_classes = [IsAdminUser]


class ToggleArticle(GenericAPIView):
    """
    Like/Dislike Article (patch method)
    """
    queryset = Article
    serializer_class = ArticleSerializer
    lookup_url_kwarg = 'article_id'
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        article = self.get_object()
        user = self.request.user
        user_liked_post = user in article.liked_by.all()
        if user_liked_post:
            article.liked_by.remove(user)
        else:
            article.liked_by.add(user)
        return Response(self.get_serializer(article).data)


class SingleArticle(RetrieveAPIView):
    """
    Get single article
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_url_kwarg = 'article_id'
    permission_classes = [IsAuthenticated]


class ArticleCategoryView(ListAPIView):
    """
    Get article by category
    """
    serializer_class = ArticleSerializer
    lookup_field = 'article_category_id'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Article.objects.filter(article_category=self.kwargs['article_category_id'])