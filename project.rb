class Project

  def initialize(project, redis)
    @project = json_project
    @redis = redis
    @url = nil
  end

  def generate_random_str(length)
    alphobet = (0..25).collect { |number| (65+number).chr }
    (0..25).each { |number| alphobet << (97+number).chr }
    random_str =''
    (1..length).each {|idx| random_str[idx] = alphobet[0].shuffle}
  end

  def save
    random_str = generate_random_str(4)
    # @redis.exist(random_str)
    @redis.set(random_str, @project)
    @url = random_str
  end

end
